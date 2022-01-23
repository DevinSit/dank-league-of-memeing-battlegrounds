const fetch = require("node-fetch");
const {Post} = require("./models");

const pruneUnavailablePosts = async (req, res) => {
    const {posts} = req.body;

    if (!posts || !Array.isArray(posts)) {
        return res.status(400).send({status: "error"});
    }

    const unavailablePosts = [];

    for (const post of posts) {
        try {
            const isMissingImageHash = await Post.isPostMissingImageHash(post.id);

            if (isMissingImageHash) {
                // This cleans up any posts that fell through the ingestion pipeline and didn't end
                // up getting assigned an imageHash (maybe because some function failed somewhere).
                await Post.deletePost(post.id);

                unavailablePosts.push(post);
            } else {
                // This handles setting `notFound` if the post's image is now 404'd.
                const {status} = await fetch(post.url);

                if (status !== 200 && post.id) {
                    await Post.setNotFound(post.id);
                    unavailablePosts.push(post);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    res.send({unavailablePosts, status: "success"});
};

module.exports = {
    pruneUnavailablePosts
};
