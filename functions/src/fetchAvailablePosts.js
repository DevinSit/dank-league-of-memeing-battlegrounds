const {Post} = require("./models");

const fetchAvailablePosts = async (req, res) => {
    const posts = (await Post.fetchAllAvailable()).map(({id, url}) => ({id, url}));
    const chunkedPosts = chunkArray(posts);

    res.send({chunkedPosts, status: "success"});
};

const chunkArray = (array, chunkSize = 20) => {
    const chunkedArray = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        chunkedArray.push(chunk);
    }

    return chunkedArray;
};

module.exports = {
    fetchAvailablePosts
};
