const cleanPosts = (posts) =>
    posts
        // Keep only png, jpg, and redditupload links
        .filter(
            ({url}) => url.includes(".png") || url.includes(".jpg") || url.includes("reddituploads")
        )
        // Fix redditupload links
        .map((post) => ({
            ...post,
            url: post.url.replace(/&amp;/g, "&")
        }));

module.exports = {
    cleanPosts
};
