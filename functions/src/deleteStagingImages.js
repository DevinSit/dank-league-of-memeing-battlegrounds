const {Storage} = require("@google-cloud/storage");
const {BUCKET_STAGING} = require("./config");
const {Post} = require("./models");

const storage = new Storage();

const deleteStagingImages = async (req, res) => {
    const {imagePaths, deletePosts} = req.body;

    console.log({imagePaths, deletePosts});

    // Due to race conditions with fetching the images,
    // process the posts using a regular for loop as opposed to Promise.all
    for (let i = 0; i < imagePaths.length; i++) {
        const path = imagePaths[i];

        // Delete the image from the staging bucket.
        await deleteStagingFile(path);

        // If an image was explicit, then we should delete its corresponding post as well.
        const fileName = extractBucketFileName(path);
        const splitFileName = fileName.split("-");

        if (deletePosts[i] === true && splitFileName[0] === "post") {
            await Post.deletePost(splitFileName[1]);
        }
    }

    console.log("Finished deleting staging images.");
    res.send({imagePaths, status: "success"});
};

const deleteStagingFile = async (path) => {
    try {
        await storage.bucket(BUCKET_STAGING).file(extractBucketFileName(path)).delete();
    } catch {
        return null;
    }
};

const extractBucketFileName = (imagePath) => {
    return imagePath.split("/").pop();
};

module.exports = {
    deleteStagingImages
};
