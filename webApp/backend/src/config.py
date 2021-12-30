import os

IMAGE_SIZE = 128
IMAGES_STORAGE_BUCKET = os.environ.get("IMAGES_STORAGE_BUCKET", "easy-dank-meme-classifier-images")

MODELS_LOCATION = os.environ.get(
    "MODEL_STORAGE_LOCATION",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "ml_models")
)

MODEL_FILE = os.path.join(MODELS_LOCATION, "vgg16_complex_small_images_40_dense_checkpoint.h5")

PROJECT_ID = "serverless-hackathon-devin"
