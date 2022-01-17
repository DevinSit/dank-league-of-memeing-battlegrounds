import {animated} from "@react-spring/web";
import {useCallback, useEffect, useState} from "react";
import {useGame} from "hooks/";
import {ValueFormatting} from "services/";
import {GamePage} from "values/gamePages";
import {useScore, useCardStackAnimation, useScoreAnimation, useTimerAnimation} from "./hooks";
import styles from "./Game.module.scss";

interface GameProps {
    images: Array<string>;
    predictions: Array<boolean>;
    setPage: (page: GamePage) => void;
}

const Game = ({images, predictions, setPage}: GameProps) => {
    const [resetTimer, setResetTimer] = useState(false);

    const [
        {
            state: {guesses, score, username}
        }
    ] = useGame();

    // On Game Over
    useEffect(() => {
        if (guesses.length === predictions.length && predictions.length !== 0) {
            fetch("/api/score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({score, username})
            }).then(() => {
                setTimeout(() => {
                    setPage(GamePage.RESULTS);
                }, 1000);
            });
        }
    }, [guesses, predictions, score, username, setPage]);

    const onResetTimer = useCallback(() => setResetTimer(true), []);

    const {onGuess, onStartTimer} = useScore(predictions, onResetTimer);
    const {cardSprings, bind, guessTopImage} = useCardStackAnimation(images, predictions, onGuess);

    const {timerStyles} = useTimerAnimation(resetTimer, onStartTimer, guessTopImage);
    const {animatedScore} = useScoreAnimation();

    return (
        <div className={styles.Game}>
            <div className={styles.GameWrapper}>
                <button className={styles.GameButtonDank} onClick={() => guessTopImage(true)}>
                    Dank
                </button>

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

                <button className={styles.GameButtonNotDank} onClick={() => guessTopImage(false)}>
                    Not Dank
                </button>

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
