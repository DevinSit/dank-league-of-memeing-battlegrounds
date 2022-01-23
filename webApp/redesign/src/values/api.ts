import {BACKEND_URL} from "config";

const url = (route: string) => `${BACKEND_URL}/api/v1${route}`;

export const api = {
    LATEST_MEMES: url("/memes"),
    MARK_MISSING_MEME: url("/memes"),
    RANDOM_MEMES: url("/memes/random"),
    PREDICT_MEME: url("/memes/predictions/file"),
    RECORD_GUESSES: url("/memes/guess"),
    LEADERBOARD: url("/leaderboard"),
    SCORE: url("/leaderboard/score")
};
