require("dotenv").config();

const express = require("express");
const {ingestPosts, predict, scrapePosts} = require("./index");

// Rewrite the prediction URL to the local one for testing.
process.env.KERAS_PREDICTION_URL = "http://localhost:5000/api/v1/memes/predictions";

const PORT = 8080;
const app = express();

app.get("/ingestPosts", ingestPosts);
app.get("/predict", predict);
app.get("/scrapePosts", scrapePosts);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
