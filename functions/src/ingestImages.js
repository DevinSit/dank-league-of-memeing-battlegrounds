const {Storage} = require("@google-cloud/storage");
const fs = require("fs");
const imageHash = require("image-hash");
const imagemagick = require("imagemagick");
const fetch = require("node-fetch");
const {BUCKET, IMAGE_FORMAT, IMAGE_SIZE} = require("./config");

const storage = new Storage();

const ingestImages = async (req, res) => {
    const {imageUrls} = req.body;

    console.log(imageUrls, "imageUrls");

    const urlsToHashes = {};

    // Due to race conditions with fetching the images,
    // process the posts using a regular for loop as opposed to Promise.all
    for (const url of imageUrls) {
        console.log("Processing: " + url);

        const fileIdPath = await downloadImage(url);

        if (fileIdPath) {
            // Image exists
            const fileNamePath = await convertImage(fileIdPath);
            const hash = await uploadImage(fileNamePath);

            urlsToHashes[url] = hash;

            // Delete the temp local images
            await deleteFile(fileIdPath);
            await deleteFile(fileNamePath);
        } else {
            console.warn(`[WARNING] ${image} does not exist.`);
        }
    }

    const imageHashes = Object.values(urlsToHashes);

    console.log("Finished ingesting images.");
    res.send({urlsToHashes, imageHashes, status: "success"});
};

const downloadImage = async (imageUrl) => {
    const fileId = `${new Date().getTime().toString()}`;
    const fileIdPath = `/tmp/${fileId}`;

    const res = await fetch(imageUrl);

    if (res.status == 404) {
        return null;
    } else {
        return new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(fileIdPath);
            res.body.pipe(fileStream);

            res.body.on("error", (err) => {
                console.error(err);
                reject(err);
            });
            fileStream.on("finish", () => resolve(fileIdPath));
        });
    }
};

const convertImage = (fileIdPath) => {
    const fileNamePath = `${fileIdPath}.${IMAGE_FORMAT}`; // Image will be converted to jpg

    return new Promise((resolve, reject) => {
        imagemagick.convert(
            [fileIdPath, "-resize", `${IMAGE_SIZE}x${IMAGE_SIZE}!`, fileNamePath],
            (err, stdout) => {
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

module.exports = {
    ingestImages
};
