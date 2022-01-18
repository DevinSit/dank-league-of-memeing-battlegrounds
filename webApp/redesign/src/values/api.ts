import {BACKEND_URL} from "config";

const url = (route: string) => `${BACKEND_URL}/api/v1${route}`;

export const api = {
    RANDOM_MEMES: url("/memes/random"),
    PREDICT_MEME: url("/memes/predictions/file"),
    LEADERBOARD: url("/leaderboard"),
    SCORE: url("/leaderboard/score")
};
