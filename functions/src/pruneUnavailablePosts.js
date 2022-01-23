const fetch = require("node-fetch");
const {Post} = require("./models");

const pruneUnavailablePosts = async (req, res) => {
    const {posts} = req.body;

    const unavailablePosts = [];

    for (const post of posts) {
        try {
            const {status} = await fetch(post.url);

            if (status !== 200 && post.id) {
                await Post.setNotFound(post.id);
                unavailablePosts.push(post);
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
