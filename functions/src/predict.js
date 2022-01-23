const {KerasPrediction} = require("./models");

const predict = async (req, res) => {
    const {imageHashes} = req.body;
    console.log(imageHashes, "imageHashes");

    if (!imageHashes) {
        return res.status(400).send({status: "error"});
    }

    const predictions = await KerasPrediction.getPredictions(imageHashes);
    console.log(predictions, "predictions");

    for (const prediction of predictions) {
        await prediction.save();
    }

    res.send({predictions, status: "success"});
};

module.exports = {
    predict
};
