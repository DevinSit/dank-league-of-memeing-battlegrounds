const {Post} = require("./models");

const ingestPartialPosts = async (req, res) => {
    const {posts: postsData} = req.body;
    console.log(postsData, "postsData");

    if (!postsData) {
        return res.status(400).send({status: "error"});
    }

    const posts = [];

    for (const postData of postsData) {
        const post = new Post(postData);

        post.save();
        posts.push(post);
    }

    console.log(posts, "posts");

    res.send({posts, status: "success"});
};

module.exports = {
    ingestPartialPosts
};
