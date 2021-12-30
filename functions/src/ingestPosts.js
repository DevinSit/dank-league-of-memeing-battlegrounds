const {Post} = require("./models");

const ingestPosts = async (req, res) => {
    const {posts: postsData, urlsToHashes} = req.body;

    const posts = [];

    for (const postData of postsData) {
        const imageHash = urlsToHashes[postData.url];
        const post = new Post({...postData, imageHash});

        post.save();
        posts.push(post);
    }

    console.log(posts, "posts");

    res.send({posts, status: "success"});
};

module.exports = {
    ingestPosts
};
