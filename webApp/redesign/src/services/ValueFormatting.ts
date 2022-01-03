export default class ValueFormatting {
    static formatScore(score: number) {
        return score.toLocaleString("en", {minimumFractionDigits: 0, maximumFractionDigits: 0});
    }
}
