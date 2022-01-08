from utils.NestableBlueprint import NestableBlueprint
from .memes.memes_controller import memes_controller
from .leaderboard.leaderboard_controller import leaderboard_controller

v1_controller = NestableBlueprint("v1", __name__, url_prefix="/v1")
v1_controller.register_blueprint(memes_controller)
v1_controller.register_blueprint(leaderboard_controller)
