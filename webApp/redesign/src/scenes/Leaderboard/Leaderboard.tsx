import {animated, useSpring, useTransition} from "@react-spring/web";
import {ValueFormatting} from "services/";
import type {Leaderboard as LeaderboardType, UserRank} from "types";
import styles from "./Leaderboard.module.scss";

interface LeaderboardProps {
    leaderboard: LeaderboardType;
    userRank: UserRank;
}

const Leaderboard = ({leaderboard, userRank}: LeaderboardProps) => {
    const transition = useTransition(leaderboard, {
        key: (item: any) => item.username,
        from: {opacity: 0, x: -500, scale: 0.7},
        enter: {opacity: 1, x: 0, scale: 1}
    });

    const animatedLeaderboard = transition((style, {score, username}, _, index) => (
        <AnimatedLeaderboardItem style={style} rank={index + 1} score={score} username={username} />
    ));

    const yourRankSpring = useSpring({from: {x: 500, scale: 0.7}, to: {x: 0, scale: 1}});

    return (
        <div className={styles.Leaderboard}>
            <div className={styles.LeaderboardSection}>
                <h1>Leaderboard</h1>

                <div className={styles.LeaderboardList}>{animatedLeaderboard}</div>
            </div>

            <div className={styles.LeaderboardSection}>
                <h1>Your Rank</h1>

                <div className={styles.LeaderboardList}>
                    <AnimatedLeaderboardItem
                        style={yourRankSpring}
                        rank={userRank.rank}
                        score={userRank.score}
                        username={userRank.username}
                    />
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;

/* Other Components */

interface LeaderboardItemProps {
    rank: number;

    score: number;

    username: string;
}

const LeaderboardItem = ({
    rank = 1,
    score = 0,
    username = "",
    ...otherProps
}: LeaderboardItemProps) => (
    <div className={styles.LeaderboardItem} {...otherProps}>
        <p className={styles.LeaderboardItemRank}>#{rank}</p>
        <p className={styles.LeaderboardItemUsername}>{username}</p>
        <p className={styles.LeaderboardItemScore}>{ValueFormatting.formatScore(score)}</p>
    </div>
);

const AnimatedLeaderboardItem = animated(LeaderboardItem);
