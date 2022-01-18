import {ValueFormatting} from "services";
import type {Leaderboard as LeaderboardType, UserRank} from "types";
import styles from "./Leaderboard.module.scss";

interface LeaderboardProps {
    leaderboard: LeaderboardType;
    userRank: UserRank;
}

const Leaderboard = ({leaderboard, userRank}: LeaderboardProps) => (
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
                <LeaderboardItem
                    rank={userRank.rank}
                    score={userRank.score}
                    username={userRank.username}
                />
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
