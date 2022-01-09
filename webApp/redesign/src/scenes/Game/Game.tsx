import {animated} from "@react-spring/web";
import {useSWR} from "hooks/";
import {ValueFormatting} from "services/";
import {api} from "values/api";
import {useScore, useCardStackAnimation, useScoreAnimation, useTimerAnimation} from "./hooks";
import styles from "./Game.module.scss";

interface Post {
    author: string;
    createdUTC: number;
    id: string;
    imageHash: string;
    kerasPrediction: number;
    permalink: string;
    score: number;
    subreddit: string;
    title: string;
    url: string;
}

const useMemeImages = () => {
    const {data} = useSWR<{posts: Array<Post>}>(api.RANDOM_MEMES, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    });

    const images = data?.posts?.map(({url}) => url) || [];
    const predictions = data?.posts?.map(({kerasPrediction}) => kerasPrediction >= 0.5) || [];

    return {images, predictions};
};

const Game = () => {
    const {images, predictions} = useMemeImages();

    const {score, onGuess} = useScore(predictions);
    const {bind, cardSprings} = useCardStackAnimation(images, onGuess);
    const {timerStyles} = useTimerAnimation();
    const {animatedScore} = useScoreAnimation(score);

    return (
        <div className={styles.Game}>
            <div className={styles.GameWrapper}>
                <button className={styles.GameButtonDank}>Dank</button>

                <div className={styles.MemeCardsStack}>
                    {cardSprings.map(({x, y, scale}, i) => (
                        <animated.div className={styles.MemeCardContainer} key={i} style={{x, y}}>
                            {/* This is the card itself, we're binding our gesture to it (and
                                inject its index so we know which is which). */}
                            <animated.div
                                {...bind(i)}
                                className={styles.MemeCard}
                                style={{
                                    transform: scale.to(trans),
                                    backgroundImage: `url(${images[i]})`
                                }}
                            />
                        </animated.div>
                    ))}
                </div>

                <button className={styles.GameButtonNotDank}>Not Dank</button>

                <div className={styles.GameScoreContainer}>
                    <div className={styles.GameTimerContainer}>
                        <animated.div className={styles.GameTimerTicker} style={timerStyles} />
                        <div className={styles.GameTimerBackground} />
                    </div>

                    <animated.p className={styles.GameScore}>
                        {animatedScore.to(ValueFormatting.formatScore)}
                    </animated.p>
                </div>
            </div>
        </div>
    );
};

export default Game;

/* Helper Stuff */

// This is being used down there in the view, it interpolates scale into a css transform
const trans = (s: number) => `scale(${s})`;
