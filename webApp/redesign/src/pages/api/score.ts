import type {NextApiRequest, NextApiResponse} from "next";
import BadWordsFilter from "bad-words";
import {api} from "values/api";

const badWordsFilter = new BadWordsFilter();

export default async function scoreHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({});
    }

    if (!req?.body?.username || !Number.isFinite(req?.body?.score)) {
        return res.status(400).json({message: "Missing data."});
    }

    const {score, username, oldUsername = ""} = req.body;

    if (badWordsFilter.isProfane(username)) {
        return res.status(400).json({message: "Invalid username."});
    }

    if (!Number.isInteger(score) || score < 0 || score > 450000) {
        return res.status(400).json({message: "Invalid score"});
    }

    try {
        await fetch(api.SCORE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({score, username, oldUsername})
        });

        return res.status(200).json({score, username, oldUsername});
    } catch {
        return res.status(500).json({});
    }
}
