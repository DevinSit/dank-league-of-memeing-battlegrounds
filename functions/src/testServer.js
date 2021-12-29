const express = require("express");

const {ingestPostsTest} = require("./ingestPosts");
const {predictTest} = require("./predict");
const {scrapePosts} = require("./scrapePosts");

const PORT = 8080;
const app = express();

app.get("/ingestion", ingestPostsTest);
app.get("/predict", predictTest);
app.get("/scrapePosts", scrapePosts);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
