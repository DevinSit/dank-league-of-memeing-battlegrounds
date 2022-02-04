import logging
from flask import abort, jsonify, request, Response
from models import MemePost
from utils import LoggingUtils
from utils.NestableBlueprint import NestableBlueprint
from .predictions.predictions_controller import predictions_controller


logger = logging.getLogger(__name__)

memes_controller = NestableBlueprint("memes", __name__, url_prefix="/memes")
memes_controller.register_blueprint(predictions_controller)

meme_post_service = MemePost()


@memes_controller.route("/", methods=["GET"])
@LoggingUtils.log_execution_time("Latest posts fetch finished")
def get_latest_posts() -> Response:
    posts = meme_post_service.get_latest_posts()

    return jsonify({
        "status": "success",
        "posts": posts
    })


@memes_controller.route("/random", methods=["GET"])
@LoggingUtils.log_execution_time("Random posts fetch finished")
def get_random_posts() -> Response:
    posts = meme_post_service.get_random_posts()

    return jsonify({
        "status": "success",
        "posts": posts
    })


# Disabled since we have the pruneUnavailablePosts workflow now.
#
# @memes_controller.route("/<post_id>", methods=["GET"])
# @LoggingUtils.log_execution_time("Mark 404 finished")
# def mark_404_post(post_id: str) -> Response:
#     meme_post_service.mark_404_post(post_id)

#     return jsonify({
#         "status": "success",
#         "postId": post_id
#     })

@memes_controller.route("/guess", methods=["POST"])
@LoggingUtils.log_execution_time("Record guesses finished")
def record_guesses() -> Response:
    data = request.get_json()

    if "guesses" not in data:
        logger.warning("Request payload is invalid")
        return jsonify(abort(400))

    meme_post_service.record_guesses(data["guesses"])

    return jsonify({"status": "success"})


@memes_controller.route("/image", methods=["POST"])
@LoggingUtils.log_execution_time("Image upload finished")
def post_image() -> Response:
    if "file" not in request.files:
        return jsonify({
            "status": "error",
            "message": "'file' is not present in the given files."
        }), 400

    image_hash = meme_post_service.process_image(request.files["file"])

    return jsonify({
        "status": "success",
        "imageHash": image_hash
    })


@memes_controller.route("/image/<image_hash>/predictions", methods=["GET"])
@LoggingUtils.log_execution_time("Image predictions fetch")
def get_image_predictions(image_hash: str) -> Response:
    results = meme_post_service.get_prediction(image_hash)

    if not results:
        return jsonify({
            "status": "pending",
            "message": "Predictions are still being processed."
        })
    else:
        # Note: This is single element tuple destructuring.
        # There used to be AutoML predictions here, but we cut them out.
        keras_prediction, = results

        return jsonify({
            "status": "success",
            "predictions": {
                "kerasPrediction": keras_prediction
            }
        })