const {Reddit} = require("./services");

/** Scrapes Reddit for image URLs based on the given query parameters.
 *
 *  Possible query params:
 *
 *  - subreddit (string, default: dankmemes) -> which subreddit to scrape
 *  - limit (int, default: 5) -> max number of records to return
 *  - hot (bool, default: false) -> Whether to get hot or new posts (defaults to new)
 */
const scrapePosts = async (req, res) => {
    const params = req.query;
    console.log(params, "query params");

    try {
        const {subreddit, limit, hot} = parseQueryParams(params);
        const posts = await Reddit.getPosts(subreddit, limit, hot);

        res.send({posts, status: "success"});
    } catch (e) {
        console.log(e);

        res.status(500).send({
            message: "Error when trying to get image URLs. See logs for more details.",
            status: "error"
        });
    }
};

const parseQueryParams = (params) => {
    const {subreddit = "dankmemes"} = params;
    const limit = parseInt(params.limit) || 5;
    const hot = params.hot == undefined ? false : params.hot == "true"; // Convert hot to a boolean

    return {
        subreddit,
        limit,
        hot
    };
};

module.exports = {
    scrapePosts
};
