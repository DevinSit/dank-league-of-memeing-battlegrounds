import {useCallback, useEffect, useState} from "react";
import {animated, useSpring, useTrail} from "@react-spring/web";
import BadWordsFilter from "bad-words";
import {CheckIcon, CloseIcon, EditIcon, ExternalLinkIcon} from "assets/icons";
import {Button} from "components/";
import {useGame, useSWR} from "hooks/";
import {ValueFormatting} from "services/";
import type {Leaderboard as LeaderboardType, Post, UserRank} from "types";
import {api} from "values/api";
import {GamePage} from "values/gamePages";
import styles from "./GameResults.module.scss";

const badWordsFilter = new BadWordsFilter();

interface GameResultsProps {
    posts: Array<Post>;
    setPage: (page: GamePage) => void;
}

const GameResults = ({posts, setPage}: GameResultsProps) => {
    const [
        {
            state: {guesses}
        }
    ] = useGame();

    const trail = useTrail(posts.length, {
        from: {opacity: 0.5, x: -200, scale: 0.8},
        to: {opacity: 1, x: 0, scale: 1}
    });

    const summarySpring = useSpring({from: {x: -500, scale: 0.7}, to: {x: 0, scale: 1}});

    useEffect(() => {
        const guessesByPost = posts.reduce((acc, post, index) => {
            acc[post.id] = guesses[index];
            return acc;
        }, {} as Record<string, boolean>);

        fetch(api.RECORD_GUESSES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({guesses: guessesByPost})
        });

        // Only run this once on mount.
        // eslint-disable-next-line
    }, []);

    return (
        <div className={styles.GameResults}>
            <AnimatedGameResultsSummary
                style={summarySpring}
                onPlayAgain={() => setPage(GamePage.GAME)}
            />

            <div className={styles.GameResultsMemes}>
                {trail.map((style, index) => (
                    <animated.div key={posts[index].id} style={style}>
                        <MemeResultCard
                            image={posts[index].url}
                            isDank={ValueFormatting.booleanizePrediction(
                                posts[index].kerasPrediction
                            )}
                            url={ValueFormatting.formatRedditLink(posts[index].permalink)}
                            wasCorrect={guesses[index]}
                        />
                    </animated.div>
                ))}
            </div>

            <div className={styles.Spacer} />
        </div>
    );
};

export default GameResults;

/* Other Components */

interface GameResultsSummaryProps {
    onPlayAgain: () => void;
}

const GameResultsSummary = ({onPlayAgain, ...otherProps}: GameResultsSummaryProps) => {
    const [
        {
            state: {score, username},
            dispatch
        },
        actions
    ] = useGame();

    const [isEditing, setIsEditing] = useState(false);
    const [editingUsername, setEditingUsername] = useState(username);

    const {data} = useSWR<{leaderboard: LeaderboardType; rank: UserRank}>(
        `${api.LEADERBOARD}/${username}`
    );

    const onSubmit = useCallback(async () => {
        let cleanedUsername = badWordsFilter.clean(editingUsername);

        await fetch("/api/score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({score, username: cleanedUsername, oldUsername: username})
        });

        dispatch(actions.setUsername(cleanedUsername));
        setIsEditing(false);
    }, [actions, editingUsername, score, username, dispatch]);

    const onCancel = useCallback(() => {
        setEditingUsername(username);
        setIsEditing(false);
    }, [username]);

    return (
        <div className={styles.GameResultsSummary} {...otherProps}>
            {isEditing ? (
                <form
                    className={styles.GameResultsUsernameContainer}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        className={styles.GameResultsUsernameInput}
                        aria-label="username"
                        required={true}
                        minLength={4}
                        maxLength={20}
                        value={editingUsername}
                        onChange={(e) => setEditingUsername(e.target.value)}
                    />

                    <button
                        type="submit"
                        name="submit"
                        className={styles.GameResultsButton}
                        onClick={onSubmit}
                    >
                        <CheckIcon className={styles.CorrectIcon} />
                    </button>

                    <button
                        type="submit"
                        name="cancel"
                        className={styles.GameResultsButton}
                        onClick={onCancel}
                    >
                        <CloseIcon className={styles.IncorrectIcon} />
                    </button>
                </form>
            ) : (
                <div className={styles.GameResultsUsernameContainer}>
                    <p className={styles.GameResultsUsername}>{username}</p>

                    <button className={styles.GameResultsButton} onClick={() => setIsEditing(true)}>
                        <EditIcon className={styles.GameResultsEditIcon} />
                    </button>
                </div>
            )}

            <p className={styles.GameResultsScore}>{ValueFormatting.formatScore(score)}</p>
            <p className={styles.GameResultsRank}>Rank #{data?.rank?.rank || 0}</p>

            <div className={styles.GameResultsButtonContainer}>
                <Button onClick={onPlayAgain}>Play Again</Button>
            </div>
        </div>
    );
};

const AnimatedGameResultsSummary = animated(GameResultsSummary);

interface MemeResultCardProps {
    image: string;
    isDank: boolean;
    url: string;
    wasCorrect: boolean;
}

const MemeResultCard = ({image, isDank, url, wasCorrect = true}: MemeResultCardProps) => (
    <div
        className={styles.MemeResultCard}
        style={{
            // Use a gradient over the image to make the info section easier to read/see.
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent), url(${image})`
        }}
    >
        <div className={styles.MemeResultsCardInfoContainer}>
            {wasCorrect ? (
                <CheckIcon className={styles.CorrectIcon} />
            ) : (
                <CloseIcon className={styles.IncorrectIcon} />
            )}

            <p className={styles.MemeResultCardPrediction}>
                {ValueFormatting.formatPrediction(isDank)}
            </p>

            <a href={url} target="_blank" rel="noreferrer">
                <ExternalLinkIcon className={styles.MemeResultCardLinkIcon} />
            </a>
        </div>
    </div>
);
