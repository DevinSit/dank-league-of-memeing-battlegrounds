const {Storage} = require("@google-cloud/storage");
const fs = require("fs");
const fetch = require("node-fetch");
const {BUCKET_STAGING} = require("./config");

const storage = new Storage();

const downloadPostImages = async (req, res) => {
    const {posts} = req.body;

    console.log(posts, "posts");

    const stagingImages = [];

    // Due to race conditions with fetching the images,
    // process the posts using a regular for loop as opposed to Promise.all
    for (const post of posts) {
        const {id, url} = post;
        console.log(`Processing post "${id}" with image "${url}"...`);

        const fileIdPath = await downloadImage(url);

        if (fileIdPath) {
            // Image exists
            const fileName = await uploadImage(fileIdPath);
            stagingImages.push(fileName);

            // Delete the temp local images
            await deleteFile(fileIdPath);
        } else {
            console.warn(`[WARNING] ${url} does not exist.`);
        }
    }

    console.log("Finished download post images.");
    res.send({images: stagingImages, status: "success"});
};

const downloadImage = async (imageUrl, postId) => {
    const fileId = `post-${postId}`;
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

const uploadImage = async (fileIdPath) => {
    const bucket = storage.bucket(BUCKET_STAGING);
    const fileName = fileIdPath.split("/").pop();

    return new Promise((resolve, reject) => {
        bucket.upload(fileIdPath, {destination: `${fileName}`}, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(fileName);
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
    downloadPostImages
};
