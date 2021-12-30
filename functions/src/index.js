const {ingestImages} = require("./ingestImages");
const {ingestPosts} = require("./ingestPosts");
const {predict} = require("./predict");
const {scrapePosts} = require("./scrapePosts");

module.exports = {
    ingestImages,
    ingestPosts,
    predict,
    scrapePosts
};
