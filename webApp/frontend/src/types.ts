export interface Post {
    author: string;
    createdUtc: number;
    id: string;
    imageHash: string;
    kerasPrediction: number;
    permalink: string;
    score: number;
    subreddit: string;
    title: string;
    url: string;
}

export interface Score {
    score: number;
    username: string;
}

export type Leaderboard = Array<Score>;

export interface UserRank extends Score {
    rank: number;
}
