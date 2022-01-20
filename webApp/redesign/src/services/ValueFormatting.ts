export default class ValueFormatting {
    static booleanizePrediction(prediction?: number) {
        return prediction ? prediction >= 0.5 : false;
    }

    static formatPrediction(isDank: boolean | number) {
        if (!isNaN(isDank as number)) {
            isDank = ValueFormatting.booleanizePrediction(isDank as number);
        }

        isDank = isDank as boolean;

        return isDank ? "Dank" : "Not Dank";
    }

    static formatScore(score: number) {
        return score.toLocaleString("en", {minimumFractionDigits: 0, maximumFractionDigits: 0});
    }

    static formatRedditLink(permalink: string) {
        return `https://www.reddit.com${permalink}`;
    }

    static formatTimeAgo(createdUtc: number) {
        const now = Math.floor(new Date().getTime() / 1000);
        const diff = now - createdUtc;
        const minutes = Math.floor(diff / 60);

        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else {
            // Floor to the nearest 5 minutes
            const floored10Minutes = Math.floor(minutes / 5) * 5;
            return `${floored10Minutes} minute${floored10Minutes !== 1 ? "s" : ""} ago`;
        }
    }
}
