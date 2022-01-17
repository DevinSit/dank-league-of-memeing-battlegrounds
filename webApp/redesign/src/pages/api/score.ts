import type {NextApiRequest, NextApiResponse} from "next";
import BadWordsFilter from "bad-words";

const badWordsFilter = new BadWordsFilter();

const postScore = (req: NextApiRequest, res: NextApiResponse) => {
    if (!req?.body?.username || !Number.isInteger(req?.body?.score)) {
        return res.status(400).json({message: "Missing data."});
    }

    const {score, username} = req.body;

    if (badWordsFilter.isProfane(username)) {
        return res.status(400).json({message: "Invalid username."});
    }

    res.status(200).json({score, username});
};

const deleteScore = (req: NextApiRequest, res: NextApiResponse) => {
    if (!req?.body?.username) {
        return res.status(400).json({message: "Missing data."});
    }

    const {username} = req.body;

    res.status(200).json({username});
};

export default function scoreHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" && req.method !== "DELETE") {
        return res.status(405).json({});
    }

    if (req.method === "POST") {
        return postScore(req, res);
    } else if (req.method === "DELETE") {
        return deleteScore(req, res);
    }
}
