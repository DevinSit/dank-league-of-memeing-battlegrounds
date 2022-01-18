import {BACKEND_URL} from "config";

const url = (route: string) => `${BACKEND_URL}/api/v1${route}`;

export const api = {
    RANDOM_MEMES: url("/memes/random"),
    LEADERBOARD: url("/leaderboard"),
    SCORE: url("/leaderboard/score")
};
