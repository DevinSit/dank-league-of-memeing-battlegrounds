const {Storage} = require("@google-cloud/storage");
const fs = require("fs");
const imageHash = require("image-hash");
const imagemagick = require("imagemagick");
const {BUCKET, BUCKET_STAGING, IMAGE_FORMAT, IMAGE_SIZE} = require("./config");

const storage = new Storage();

const processImages = async (req, res) => {
    const {imagePaths} = req.body;
    console.log(imagePaths, "imagePaths");

    if (!imagePaths) {
        return res.status(400).send({status: "error"});
    }

    const postsToHashes = {};

    // Due to race conditions with fetching the images,
    // process the posts using a regular for loop as opposed to Promise.all.
    for (const path of imagePaths) {
        console.log("Processing: " + path);

        const fileIdPath = await downloadImage(path);

        if (fileIdPath) {
            // Image exists.
            const fileNamePath = await convertImage(fileIdPath);
            const hash = await uploadImage(fileNamePath);

            const originalFileName = extractBucketFileName(path).split(".")[0].split("-");

            if (originalFileName[0] === "post") {
                postsToHashes[originalFileName[1]] = hash;
            }

            // Delete the temp local images.
            await deleteFile(fileIdPath);
            await deleteFile(fileNamePath);
        } else {
            console.warn(`[WARNING] ${path} does not exist.`);
        }
    }

    const imageHashes = Object.values(postsToHashes);

    console.log("Finished ingesting images.");
    res.send({imageHashes, postsToHashes, status: "success"});
};

const downloadImage = async (imagePath) => {
    const fileId = extractBucketFileName(imagePath);
    const fileIdPath = `/tmp/${fileId}`;

    try {
        await storage.bucket(BUCKET_STAGING).file(fileId).download({destination: fileIdPath});

        return fileIdPath;
    } catch {
        return null;
    }
};

const convertImage = (fileIdPath) => {
    const fileNamePath = `${fileIdPath}.${IMAGE_FORMAT}`; // Image will be converted to jpg

    return new Promise((resolve, reject) => {
        imagemagick.convert(
            [fileIdPath, "-resize", `${IMAGE_SIZE}x${IMAGE_SIZE}!`, fileNamePath],
            (err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(fileNamePath);
                }
            }
        );
    });
};

const uploadImage = async (fileNamePath) => {
    const bucket = storage.bucket(BUCKET);
    const hash = await hashImage(fileNamePath);

    return new Promise((resolve, reject) => {
        bucket.upload(fileNamePath, {destination: `${hash}.${IMAGE_FORMAT}`}, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
};

const hashImage = (fileNamePath) => {
    return new Promise((resolve, reject) => {
        imageHash(fileNamePath, 16, true, (err, hash) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
};

const deleteFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err) => {
            // Make sure file exists
            if (err) {
                console.error(err);
                reject(err);
            } else {
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
};

const extractBucketFileName = (imagePath) => {
    return imagePath.split("/").pop();
};

module.exports = {
    processImages
};
