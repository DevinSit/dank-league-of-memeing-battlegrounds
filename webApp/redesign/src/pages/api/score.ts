import type {NextApiRequest, NextApiResponse} from "next";
import BadWordsFilter from "bad-words";

const badWordsFilter = new BadWordsFilter();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({});
    }

    if (!req?.body?.username || !req?.body?.score) {
        return res.status(400).json({message: "Missing data."});
    }

    const {score, username} = req.body;

    if (badWordsFilter.isProfane(username)) {
        return res.status(400).json({message: "Invalid username."});
    }

    res.status(200).json({score, username});
}
