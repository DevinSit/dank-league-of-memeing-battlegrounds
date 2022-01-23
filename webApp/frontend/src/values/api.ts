import {BACKEND_URL, BACKEND_SERVER_URL} from "config";

const url = (route: string) => `${BACKEND_URL}/api/v1${route}`;
const serverUrl = (route: string) => `${BACKEND_SERVER_URL}/api/v1${route}`;

export const api = {
    serverSide: {
        LATEST_MEMES: serverUrl("/memes"),
        SCORE: serverUrl("/leaderboard/score")
    },
    MARK_MISSING_MEME: url("/memes"),
    RANDOM_MEMES: url("/memes/random"),
    PREDICT_MEME: url("/memes/predictions/file"),
    RECORD_GUESSES: url("/memes/guess"),
    LEADERBOARD: url("/leaderboard"),
    POST_SCORE: "/api/score"
};
