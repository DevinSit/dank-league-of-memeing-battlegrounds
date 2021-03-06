import json
import os
import logging
import random
from cachetools import cached, TTLCache
from google.cloud import datastore, storage
from typing import BinaryIO, Dict, List, Tuple
from werkzeug.utils import secure_filename
from config import IMAGE_SIZE, IMAGES_STORAGE_BUCKET
from utils.blockhash import hash_image


logger = logging.getLogger(__name__)
post_cache = TTLCache(maxsize=10, ttl=1800)
all_posts_cache = TTLCache(maxsize=100, ttl=1800)
predictions_cache = TTLCache(maxsize=200, ttl=3600)

POST_KIND = "RedditPost"
POST_GUESS_KIND = "RedditPostGuesses"
KERAS_PREDICTION_KIND = "DankKerasPrediction"


class MemePost:
    def __init__(self):
        self.datastore_client = datastore.Client()
        self.storage_client = storage.Client()
        pass

    def get_latest_posts(self, number_of_posts=10):
        return self._fetch_latest_posts(number_of_posts)

    def get_random_posts(self, number_of_posts=15):
        return self._fetch_random_posts(number_of_posts)

    def mark_404_post(self, post_id: str):
        key = self.datastore_client.key(POST_KIND, post_id)
        post_entity = self.datastore_client.get(key)

        if post_entity and not post_entity["notFound"]:
            post_entity["notFound"] = True
            self.datastore_client.put(post_entity)

    def process_image(self, request_file: BinaryIO):
        destination = os.path.join("/tmp", secure_filename(request_file.filename))
        request_file.save(destination)

        image_hash = hash_image(destination, "{0}x{0}".format(IMAGE_SIZE))

        # Image has already been processed recently; no need to process it again
        if image_hash in predictions_cache:
            return image_hash

        hash_filename = image_hash + ".jpg"
        hash_source = os.path.join("/tmp", hash_filename)

        bucket = self.storage_client.get_bucket(IMAGES_STORAGE_BUCKET)
        blob = bucket.blob(hash_filename)

        blob.upload_from_filename(hash_source)
        os.remove(destination)
        os.remove(hash_source)

        message = json.dumps([{"imageHash": image_hash}]).encode("utf-8")

        # TODO: Notify `predict` function

        return image_hash

    def get_prediction(self, image_hash: str) -> Tuple[float, float]:
        if image_hash in predictions_cache and predictions_cache[image_hash]:
            return predictions_cache[image_hash]

        keras_key = self.datastore_client.key(KERAS_PREDICTION_KIND, image_hash)
        keras_prediction = self.datastore_client.get(keras_key)

        if keras_prediction:
            predictions = (keras_prediction["prediction"])
            predictions_cache[image_hash] = predictions

            return predictions
        else:
            return None

    def record_guesses(self, guesses: Dict[str, bool]):
        for post_id, guess in guesses.items():
            guess_entity = self._fetch_guess(post_id)

            if guess:
                guess_entity["dank"] += 1
            else:
                guess_entity["notDank"] += 1

            self.datastore_client.put(guess_entity)

    @cached(post_cache)
    def _fetch_latest_posts(self, number_of_posts=10) -> List[datastore.Entity]:
        query = self.datastore_client.query(kind=POST_KIND, order=["-createdUtc"])

        posts = list(filter(lambda x: x["imageHash"], list(query.fetch(limit=number_of_posts))))
        posts = self._sort_by_image_hash(posts)
        posts = self._enrich_posts_with_scores(posts)

        return sorted(posts, key=lambda post: post["createdUtc"], reverse=True)

    def _fetch_random_posts(self, number_of_posts=15) -> List[datastore.Entity]:
        if number_of_posts in all_posts_cache:
            posts = all_posts_cache[number_of_posts]
        else:
            query = self.datastore_client.query(kind=POST_KIND)
            query.add_filter("notFound", "=", False)
            posts = list(filter(lambda x: x["imageHash"], list(query.fetch())))
            posts = self._sort_by_image_hash(posts)
            all_posts_cache[number_of_posts] = posts

        posts = random.sample(posts, min(len(posts), number_of_posts))
        posts = self._enrich_posts_with_scores(posts)

        return posts

    def _fetch_guess(self, post_id: str) -> datastore.Entity:
        key = self.datastore_client.key(POST_GUESS_KIND, post_id)
        guess_entity = self.datastore_client.get(key)

        if not guess_entity:
            guess_entity = datastore.Entity(key=key)
            guess_entity["id"] = post_id
            guess_entity["dank"] = 0
            guess_entity["notDank"] = 0

        return guess_entity

    def _enrich_posts_with_scores(self, posts):
        keras_keys = [self.datastore_client.key(KERAS_PREDICTION_KIND, post["imageHash"]) for post in posts]

        # Because datastore_client.get_multi() doesn't return Entities in the same order as the given keys,
        # we have to sort everything by image hash. This way also fixes an issue with using a dict indexed
        # by image hash where only one post of multiple with the same hash (e.g. the "Image not found" hash)
        # would get predictions.
        keras_predictions = self._sort_by_image_hash(self.datastore_client.get_multi(keras_keys))

        for post, keras_prediction in zip(posts, keras_predictions):
            post["kerasPrediction"] = keras_prediction["prediction"]

        return posts

    def _sort_by_image_hash(self, object_list):
        return sorted(object_list, key=lambda x: x["imageHash"])
