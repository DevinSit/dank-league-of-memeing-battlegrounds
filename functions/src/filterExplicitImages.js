const Vision = require("@google-cloud/vision");

const visionClient = new Vision.ImageAnnotatorClient();

const filterExplicitImages = async (req, res) => {
    const {imagePaths} = req.body;

    console.log(imagePaths, "imagePaths");

    const results = [];

    for (const path of imagePaths) {
        console.log("Processing: " + path);

        const [result] = await visionClient.safeSearchDetection(path);
        const detections = result.safeSearchAnnotation;

        results.push(isExplicit(detections));
    }

    console.log(results, "Finished processing images");
    res.send({results, status: "success"});
};

const isExplicit = (detections) => {
    console.log(detections);

    return (
        detections?.adult === "LIKELY" ||
        detections?.adult === "VERY_LIKELY" ||
        detections?.racy === "LIKELY" ||
        detections?.racy === "VERY_LIKELY"
    );
};

module.exports = {
    filterExplicitImages
};
