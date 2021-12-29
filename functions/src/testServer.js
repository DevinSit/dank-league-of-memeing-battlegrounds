const express = require("express");

const {ingestPosts, predict, scrapePosts} = require("./index");

const PORT = 8080;
const app = express();

app.get("/ingestPosts", ingestPosts);
app.get("/predict", predict);
app.get("/scrapePosts", scrapePosts);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
