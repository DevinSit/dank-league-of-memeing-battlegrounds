import classNames from "classnames";
import {animated, config, useSpring} from "@react-spring/web";
import {useCallback, useEffect, useMemo, useState} from "react";
import {ValueFormatting} from "services/";
import {GamePage} from "values/gamePages";
import {
    useCardStackAnimation,
    useCountdown,
    useGameOver,
    useScore,
    useScoreAnimation,
    useTimerAnimation
} from "./hooks";
import styles from "./Game.module.scss";

interface GameProps {
    images: Array<string>;
    predictions: Array<boolean>;
    setPage: (page: GamePage) => void;
}

const Game = ({images, predictions, setPage}: GameProps) => {
    const [resetTimer, setResetTimer] = useState(false);

    const onResetTimer = useCallback(() => setResetTimer(true), []);

    const {countdown, hideCountdown} = useCountdown();
    const {adjustments, onGuess, onStartTimer} = useScore(predictions, onResetTimer);
    const {cardSprings, bind, guessTopImage} = useCardStackAnimation(images, predictions, onGuess);
    const {timerStyles} = useTimerAnimation(resetTimer, onStartTimer, guessTopImage);
    const {animatedScore} = useScoreAnimation();

    useGameOver(predictions, setPage);

    return (
        <div className={styles.Game}>
            {!hideCountdown && (
                <div className={styles.CountdownOverlay}>
                    <animated.div className={styles.CountdownTimer}>
                        {countdown.to(ValueFormatting.formatScore)}
                    </animated.div>
                </div>
            )}

            <div className={styles.GameWrapper}>
                <button className={styles.GameButtonDank} onClick={() => guessTopImage(true)}>
                    Dank
                </button>

                {hideCountdown ? (
                    <div className={styles.MemeCardsStack}>
                        {cardSprings.map(({x, y, scale}, i) => (
                            <animated.div
                                className={styles.MemeCardContainer}
                                key={i}
                                style={{x, y}}
                            >
                                {/* This is the card itself, we're binding our gesture to it (and
                                    inject its index so we know which is which). */}
                                <animated.div
                                    {...bind(i)}
                                    className={styles.MemeCard}
                                    style={{
                                        transform: scale.to((s) => `scale(${s})`),
                                        backgroundImage: `url(${images[i]})`
                                    }}
                                />
                            </animated.div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.MemeCardsStackDummy} />
                )}

                <button className={styles.GameButtonNotDank} onClick={() => guessTopImage(false)}>
                    Not Dank
                </button>

                <div className={styles.GameScoreTimerContainer}>
                    <div className={styles.GameTimerContainer}>
                        <animated.div className={styles.GameTimerTicker} style={timerStyles} />
                        <div className={styles.GameTimerBackground} />
                    </div>

                    <div className={styles.GameScoreContainer}>
                        <animated.p className={styles.GameScore}>
                            {animatedScore.to(ValueFormatting.formatScore)}
                        </animated.p>

                        {adjustments.map((adjustment, index) => (
                            <AnimatedAdjustment key={index} adjustment={adjustment} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;

/* Helper Stuff */

interface AnimatedAdjustmentProps {
    adjustment?: number;
    index?: number;
}

const AnimatedAdjustment = ({adjustment = 1230, index = 0}: AnimatedAdjustmentProps) => {
    const [done, setDone] = useState(false);

    const seed = useMemo(() => Math.random(), []);
    const direction = useMemo(() => (seed < 0.5 ? -1 : 1), [seed]);

    const from = useMemo(() => calcFrom(seed, direction), [seed, direction]);

    const to = useMemo(
        () => calcTo(seed, direction, adjustment, index),
        [seed, direction, adjustment, index]
    );

    const style = useSpring({
        from,
        to,
        delay: 200,
        config: config.stiff
    });

    useEffect(() => {
        setTimeout(() => {
            setDone(true);
        }, 1000);
    }, []);

    return !done ? (
        <animated.p
            className={classNames(styles.AnimatedAdjustment, {
                [styles.AnimatedAdjustmentNegative]: adjustment < 0
            })}
            style={style}
        >
            {adjustment > 0 ? "+" : "-"}
            {ValueFormatting.formatScore(Math.abs(adjustment))}
        </animated.p>
    ) : null;
};

const calcFrom = (seed: number, direction: number) => {
    return {x: 100 * seed * direction, y: 0, opacity: 0, rotate: 0, scale: 1};
};

const calcTo = (seed: number, direction: number, adjustment: number, index: number) => {
    const quadrant = (() => {
        if (index % 3 === 0) {
            return -100;
        } else if (index % 3 === 1) {
            return -50;
        } else if (index % 3 === 2) {
            return 50;
        } else {
            return 100;
        }
    })();

    return {
        x: quadrant + 20 * (seed + 1) * direction,
        y: -100 - 50 * Math.random(),
        opacity: 1,
        rotate: (5 + 3 * Math.random()) * direction,
        scale: scaleValue(Math.abs(adjustment), [0, 15000], [70, 180]) / 100
    };
};

// https://gist.github.com/fpillet/993002
function scaleValue(value: number, from: [number, number], to: [number, number]): number {
    const scale = (to[1] - to[0]) / (from[1] - from[0]);
    const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];

    return ~~(capped * scale + to[0]);
}
