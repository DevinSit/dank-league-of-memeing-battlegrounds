import logging
from flask import abort, jsonify, request, Response
from models import LeaderboardScore
from utils import LoggingUtils
from utils.NestableBlueprint import NestableBlueprint


logger = logging.getLogger(__name__)

leaderboard_controller = NestableBlueprint("leaderboard", __name__, url_prefix="/leaderboard")

leaderboard_score_service = LeaderboardScore()


@leaderboard_controller.route("/", methods=["GET"])
@LoggingUtils.log_execution_time("Top leaderboard scores finished")
def get_leaderboard() -> Response:
    scores = leaderboard_score_service.get_top_scores()

    return jsonify({
        "status": "success",
        "leaderboard": scores
    })


@leaderboard_controller.route("/score", methods=["POST"])
@LoggingUtils.log_execution_time("Score post finished")
def post_score() -> Response:
    data = request.get_json()
    logger.info("Request data: " + str(data))

    if "username" not in data or "score" not in data:
        logger.warning("Request payload is invalid")
        return jsonify(abort(400))

    score = leaderboard_score_service.post_score(data["username"], data["score"], data.get("oldUsername", ""))

    return jsonify({
        "status": "success",
        "score": score
    })


@leaderboard_controller.route("/score/<username>", methods=["GET"])
@LoggingUtils.log_execution_time("Score get finished")
def get_score(username: str) -> Response:
    score = leaderboard_score_service.get_score(username)

    if not score:
        return jsonify({
            "status": "error",
            "message": "Failed to retrieve score for user " + username
        }), 404

    return jsonify({
        "status": "success",
        "score": score
    })
