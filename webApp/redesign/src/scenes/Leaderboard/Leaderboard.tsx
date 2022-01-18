import {ValueFormatting} from "services";
import type {Leaderboard as LeaderboardType} from "types";
import styles from "./Leaderboard.module.scss";

interface LeaderboardProps {
    leaderboard: LeaderboardType;
}

const Leaderboard = ({leaderboard}: LeaderboardProps) => (
    <div className={styles.Leaderboard}>
        <div className={styles.LeaderboardSection}>
            <h1>Leaderboard</h1>

            <div className={styles.LeaderboardList}>
                {leaderboard.map(({score, username}, index) => (
                    <LeaderboardItem
                        key={index}
                        rank={index + 1}
                        score={score}
                        username={username}
                    />
                ))}
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
