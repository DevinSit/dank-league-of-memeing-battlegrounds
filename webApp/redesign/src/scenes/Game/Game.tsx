import {animated} from "@react-spring/web";
import {useCallback, useState, Dispatch, SetStateAction} from "react";
import {ValueFormatting} from "services/";
import {GamePage} from "values/gamePages";
import {useScore, useCardStackAnimation, useScoreAnimation, useTimerAnimation} from "./hooks";
import styles from "./Game.module.scss";

interface GameProps {
    images: Array<string>;
    predictions: Array<boolean>;
    score: number;
    setGuesses: Dispatch<SetStateAction<Array<boolean>>>;
    setPage: (page: GamePage) => void;
    setScore: Dispatch<SetStateAction<number>>;
}

const Game = ({images, predictions, score, setGuesses, setPage, setScore}: GameProps) => {
    const [resetTimer, setResetTimer] = useState(false);

    const onResetTimer = useCallback(() => setResetTimer(true), []);
    const onGameOver = useCallback(() => setPage(GamePage.RESULTS), [setPage]);

    const {onGuess, onStartTimer} = useScore(predictions, onResetTimer, setGuesses, setScore);
    const {cardSprings, bind, removeTopImage} = useCardStackAnimation(images, onGuess, onGameOver);
    const {timerStyles} = useTimerAnimation(resetTimer, onStartTimer, removeTopImage);
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
