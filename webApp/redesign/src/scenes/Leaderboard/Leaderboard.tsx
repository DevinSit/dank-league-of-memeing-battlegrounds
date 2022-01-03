import {ValueFormatting} from "services";
import styles from "./Leaderboard.module.scss";

const Leaderboard = () => (
    <div className={styles.Leaderboard}>
        <div className={styles.LeaderboardSection}>
            <h1>Leaderboard</h1>

            <div className={styles.LeaderboardList}>
                <LeaderboardItem rank={1} score={1230000} username="Archangl" />
                <LeaderboardItem rank={2} score={1230000} username="Archangl" />
                <LeaderboardItem rank={3} score={1230000} username="Archangl" />
                <LeaderboardItem rank={4} score={1230000} username="Archangl" />
                <LeaderboardItem rank={5} score={1230000} username="Archangl" />
            </div>
        </div>

        <div className={styles.LeaderboardSection}>
            <h1>Your Rank</h1>

            <div className={styles.LeaderboardList}>
                <LeaderboardItem rank={1000} score={1230000} username="Archangl10" />
            </div>
        </div>
    </div>
);

export default Leaderboard;

/* Other Components */

interface LeaderboardItemProps {
    rank: number;

    score: number;

    username: string;
}

const LeaderboardItem = ({rank = 1, score = 0, username = ""}: LeaderboardItemProps) => (
    <div className={styles.LeaderboardItem}>
        <p className={styles.LeaderboardItemRank}>#{rank}</p>
        <p className={styles.LeaderboardItemUsername}>{username}</p>
        <p className={styles.LeaderboardItemScore}>{ValueFormatting.formatScore(score)}</p>
    </div>
);
