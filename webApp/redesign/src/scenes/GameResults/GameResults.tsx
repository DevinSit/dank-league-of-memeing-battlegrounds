import {useCallback, useState} from "react";
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

    return (
        <div className={styles.GameResults}>
            <GameResultsSummary onPlayAgain={() => setPage(GamePage.GAME)} />

            <div className={styles.GameResultsMemes}>
                {posts.map(({id, author, permalink, url}, index) => (
                    <MemeResultCard
                        key={id}
                        author={author}
                        image={url}
                        url={ValueFormatting.formatRedditLink(permalink)}
                        wasCorrect={guesses[index]}
                    />
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

const GameResultsSummary = ({onPlayAgain}: GameResultsSummaryProps) => {
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
        <div className={styles.GameResultsSummary}>
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

interface MemeResultCardProps {
    author: string;

    image: string;

    url: string;

    wasCorrect?: boolean;
}

const MemeResultCard = ({author, image, url, wasCorrect = true}: MemeResultCardProps) => (
    <div
        className={styles.MemeResultCard}
        style={{
            // Use a gradient over the image to make the info section easier to read/see.
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent), url(${image})`
        }}
    >
        <div className={styles.MemeResultsCardInfoContainer}>
            {wasCorrect ? (
                <CheckIcon className={styles.CorrectIcon} />
            ) : (
                <CloseIcon className={styles.IncorrectIcon} />
            )}

            <p className={styles.MemeResultCardAuthor}>By {author}</p>

            <a href={url} target="_blank" rel="noreferrer">
                <ExternalLinkIcon className={styles.MemeResultCardLinkIcon} />
            </a>
        </div>
    </div>
);
