import {CheckIcon, CloseIcon, EditIcon, ExternalLinkIcon} from "assets/icons";
import {Button} from "components/";
import {useGame} from "hooks/";
import {ValueFormatting} from "services/";
import {GamePage} from "values/gamePages";
import styles from "./GameResults.module.scss";

interface GameResultsProps {
    images: Array<string>;
    urls: Array<string>;
    setPage: (page: GamePage) => void;
}

const GameResults = ({images, urls, setPage}: GameResultsProps) => {
    const [
        {
            state: {guesses, score}
        }
    ] = useGame();

    return (
        <div className={styles.GameResults}>
            <div className={styles.GameResultsSummary}>
                <div className={styles.GameResultsUsernameContainer}>
                    <p className={styles.GameResultsUsername}>Username</p>

                    <button className={styles.GameResultsEditButton}>
                        <EditIcon className={styles.GameResultsEditIcon} />
                    </button>
                </div>

                <p className={styles.GameResultsScore}>{ValueFormatting.formatScore(score)}</p>
                <p className={styles.GameResultsRank}>Rank #1</p>

                <div className={styles.GameResultsButtonContainer}>
                    <Button onClick={() => setPage(GamePage.GAME)}>Play Again</Button>
                </div>
            </div>

            <div className={styles.GameResultsMemes}>
                {images.map((image, index) => (
                    <MemeResultCard
                        key={image}
                        image={image}
                        url={urls[index]}
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

interface MemeResultCardProps {
    image: string;

    url: string;

    username?: string;

    wasCorrect?: boolean;
}

const MemeResultCard = ({
    image,
    url,
    username = "username",
    wasCorrect = true
}: MemeResultCardProps) => (
    <div
        className={styles.MemeResultCard}
        style={{
            // Use a gradient over the image to make the info section easier to read/see.
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent), url(${image})`
        }}
    >
        <div className={styles.MemeResultsCardInfoContainer}>
            {wasCorrect ? (
                <CheckIcon className={styles.MemeResultCardCorrectIcon} />
            ) : (
                <CloseIcon className={styles.MemeResultCardIncorrectIcon} />
            )}

            <p className={styles.MemeResultCardUsername}>By {username}</p>

            <a href={url} target="_blank" rel="noreferrer">
                <ExternalLinkIcon className={styles.MemeResultCardLinkIcon} />
            </a>
        </div>
    </div>
);
