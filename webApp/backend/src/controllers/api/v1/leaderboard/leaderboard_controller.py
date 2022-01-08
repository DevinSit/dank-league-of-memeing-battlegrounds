import logging
from flask import jsonify, request, Response
from google.cloud import datastore
from utils import LoggingUtils
from utils.NestableBlueprint import NestableBlueprint


logger = logging.getLogger(__name__)

leaderboard_controller = NestableBlueprint("leaderboard", __name__, url_prefix="/leaderboard")

datastore_client = datastore.Client()


@leaderboard_controller.route("/", methods=["GET"])
@LoggingUtils.log_execution_time("Leaderboard test")
def test_leaderboard() -> Response:
    key = datastore_client.key("DATATSTORE_TEST", "123")
    entity = datastore_client.get(key)

    # entity = datastore.Entity(key=key)
    # entity["thing"] = "other"

    # datastore_client.put(entity)

    return jsonify({
        "status": "success",
        "leaderboard": entity
    })

