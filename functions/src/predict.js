const {KerasPrediction} = require("./models");

const predict = async (req, res) => {
    const posts = req.body;
    console.log(posts, "posts");

    const postsWithImageHashes = posts.filter((post) => post.imageHash != "");
    const predictions = await KerasPrediction.getPredictions(postsWithImageHashes);
    console.log(predictions, "predictions");

    predictions.forEach((prediction) => prediction.save());

    res.send({status: "success"});
};

module.exports = {
    predict
};
