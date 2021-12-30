require("dotenv").config();

// Rewrite the prediction URL to the local one for testing.
process.env.KERAS_PREDICTION_URL = "http://localhost:5000/api/v1/memes/predictions";

const express = require("express");
const {ingestImages, ingestPosts, predict, scrapePosts} = require("./index");

const PORT = 8080;
const app = express();

app.use(express.json());

app.get("/scrapePosts", scrapePosts);
app.post("/ingestImages", ingestImages);
app.post("/ingestPosts", ingestPosts);
app.post("/predict", predict);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
