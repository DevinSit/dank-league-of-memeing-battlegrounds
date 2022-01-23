require("dotenv").config();

// Rewrite the prediction URL to the local one for testing.
process.env.KERAS_PREDICTION_URL = "http://localhost:5000/api/v1/memes/predictions";

const express = require("express");
const {
    deleteStagingImages,
    downloadPostImages,
    filterExplicitImages,
    ingestPartialPosts,
    predict,
    processImages,
    scrapePosts,
    updatePostHashes
} = require("./index");

const PORT = 8080;
const app = express();

app.use(express.json());

app.get("/scrapePosts", scrapePosts);
app.post("/downloadPostImages", downloadPostImages);
app.post("/filterExplicitImages", filterExplicitImages);
app.post("/ingestPartialPosts", ingestPartialPosts);
app.post("/processImages", processImages);
app.post("/predict", predict);
app.post("/updatePostHashes", updatePostHashes);
app.post("/deleteStagingImages", deleteStagingImages);

app.listen(PORT, () => {
    console.log("App listening on port " + PORT + ".");
});
