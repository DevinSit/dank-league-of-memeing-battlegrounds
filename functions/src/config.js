const BUCKET = "easy-dank-meme-classifier-images";
const BUCKET_STAGING = "easy-dank-meme-classifier-staging-images";
const IMAGE_FORMAT = "jpg";
const IMAGE_SIZE = 128;
const PROJECT_ID = "serverless-hackathon-devin";

const {
    CLIENT_ID,
    CLIENT_SECRET,
    USER_AGENT,
    REDDIT_USERNAME,
    REDDIT_PASSWORD,
    KERAS_PREDICTION_URL
} = process.env;

module.exports = {
    BUCKET,
    BUCKET_STAGING,
    IMAGE_FORMAT,
    IMAGE_SIZE,
    PROJECT_ID,
    CLIENT_ID,
    CLIENT_SECRET,
    USER_AGENT,
    REDDIT_USERNAME,
    REDDIT_PASSWORD,
    KERAS_PREDICTION_URL
};
