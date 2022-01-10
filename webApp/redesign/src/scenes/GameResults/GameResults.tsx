import {CheckIcon, CloseIcon, EditIcon, ExternalLinkIcon} from "assets/icons";
import {LinkButton} from "components/";
import {ScreenUrls} from "values/screenUrls";
import styles from "./GameResults.module.scss";

interface GameResultsProps {
    images: Array<string>;
}

const GameResults = ({images}: GameResultsProps) => (
    <div className={styles.GameResults}>
        <div className={styles.GameResultsSummary}>
            <div className={styles.GameResultsUsernameContainer}>
                <p className={styles.GameResultsUsername}>Username</p>

                <button className={styles.GameResultsEditButton}>
                    <EditIcon className={styles.GameResultsEditIcon} />
                </button>
            </div>

            <p className={styles.GameResultsScore}>1,230,000</p>
            <p className={styles.GameResultsRank}>Rank #1</p>

            <div className={styles.GameResultsButtonContainer}>
                <LinkButton href={ScreenUrls.GAME}>Play Again</LinkButton>
            </div>
        </div>

        <div className={styles.GameResultsMemes}>
            {images.map((image, index) => (
                <MemeResultCard key={image} image={image} wasCorrect={!!(index % 3)} />
            ))}
        </div>

        <div className={styles.Spacer} />
    </div>
);

export default GameResults;

/* Other Components */

interface MemeResultCardProps {
    image: string;

    link?: string;

    username?: string;

    wasCorrect?: boolean;
}

const MemeResultCard = ({
    image,
    link = "",
    username = "username",
    wasCorrect = true
}: MemeResultCardProps) => (
    <div
        className={styles.MemeResultCard}
        style={{
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

            <a href={link} target="_blank" rel="noreferrer">
                <ExternalLinkIcon className={styles.MemeResultCardLinkIcon} />
            </a>
        </div>
    </div>
);
