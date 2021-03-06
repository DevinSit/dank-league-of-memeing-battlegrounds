const fetch = require("node-fetch");
const Datastore = require("@google-cloud/datastore");
const {KERAS_PREDICTION_URL, PROJECT_ID} = require("../config");

const datastore = new Datastore({projectId: PROJECT_ID});

class KerasPrediction {
    constructor({imageHash = "", prediction = 0}) {
        this.imageHash = imageHash;
        this.prediction = prediction;
    }

    entity() {
        const kind = "DankKerasPrediction";
        const key = datastore.key([kind, this.imageHash]);

        return {
            key,
            data: {
                imageHash: this.imageHash,
                prediction: this.prediction
            },
            excludeFromIndexes: ["prediction"]
        };
    }

    async save() {
        await datastore.upsert(this.entity());
    }

    static async getPredictions(imageHashes) {
        const response = await fetch(KERAS_PREDICTION_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({imageHashes})
        });

        const predictions = (await response.json())["predictions"];

        return imageHashes.map(
            (imageHash, index) =>
                new KerasPrediction({
                    imageHash,
                    prediction: predictions[index]
                })
        );
    }
}

module.exports = KerasPrediction;
