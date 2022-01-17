import logging
from google.cloud import datastore
from typing import List


logger = logging.getLogger(__name__)

LEADERBOARD_SCORE_KIND = "LeaderboardScore"


class LeaderboardScore:
    def __init__(self):
        self.datastore_client = datastore.Client()
        pass

    def get_score(self, username: str) -> datastore.Entity:
        key = self._generate_score_key(username)
        leaderboard_score_entity = self.datastore_client.get(key)

        return leaderboard_score_entity

    def post_score(self, username: str, score: int, oldUsername: str = "") -> datastore.Entity:
        if oldUsername:
            old_leaderboard_score_entity = self.get_score(oldUsername)

            if old_leaderboard_score_entity:
                self.delete_score(oldUsername)

                key = self._generate_score_key(username)
                leaderboard_score_entity = datastore.Entity(key=key)
                leaderboard_score_entity["username"] = username
                leaderboard_score_entity["score"] = old_leaderboard_score_entity["score"]

                if old_leaderboard_score_entity["score"] < score:
                    leaderboard_score_entity["score"] = score
            else:
                leaderboard_score_entity = self.get_score(username)

                if leaderboard_score_entity and leaderboard_score_entity["score"] > score:
                    return leaderboard_score_entity
                elif leaderboard_score_entity and leaderboard_score_entity["score"] < score:
                    leaderboard_score_entity["score"] = score
                else:
                    key = self._generate_score_key(username)
                    leaderboard_score_entity = datastore.Entity(key=key)

                    leaderboard_score_entity["username"] = username
                    leaderboard_score_entity["score"] = score
        else:
            leaderboard_score_entity = self.get_score(username)

            if leaderboard_score_entity and leaderboard_score_entity["score"] > score:
                return leaderboard_score_entity
            elif leaderboard_score_entity and leaderboard_score_entity["score"] < score:
                leaderboard_score_entity["score"] = score
            else:
                key = self._generate_score_key(username)
                leaderboard_score_entity = datastore.Entity(key=key)

                leaderboard_score_entity["username"] = username
                leaderboard_score_entity["score"] = score

        self.datastore_client.put(leaderboard_score_entity)

        return leaderboard_score_entity

    def delete_score(self, username: str):
        key = self._generate_score_key(username)
        self.datastore_client.delete(key)

    def get_top_scores(self, number_of_scores=5) -> List[datastore.Entity]:
        query = self.datastore_client.query(kind=LEADERBOARD_SCORE_KIND, order=["-score"])
        leaderboard_scores = list(query.fetch(limit=number_of_scores))

        return leaderboard_scores

    def _generate_score_key(self, username: str):
        key = self.datastore_client.key(LEADERBOARD_SCORE_KIND, username)
        return key
