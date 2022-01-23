const {Post} = require("./models");

const updatePostHashes = async (req, res) => {
    const {postsToHashes} = req.body;

    const posts = [];

    for (const postId of Object.keys(postsToHashes)) {
        if (postId) {
            const imageHash = postsToHashes[postId];
            const post = await Post.updateHash(postId, imageHash);

            if (post) {
                posts.push(post);
            }
        }
    }

    console.log(posts, "posts");

    res.send({posts, status: "success"});
};

module.exports = {
    updatePostHashes
};
