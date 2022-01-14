import {useCallback, useRef, useState} from "react";
import {useSpring, useSprings} from "@react-spring/web";
import {useDrag} from "react-use-gesture";
import {useGame} from "hooks/";

const TIMER_SECONDS = 5;
const TIMER_DURATION = TIMER_SECONDS * 1000;
const BASE_SCORE = 10000;

export const useScore = (predictions: Array<boolean>, onResetTimer: () => void) => {
    const [{dispatch}, actions] = useGame();
    const timerRef = useRef<number>(Date.now());

    const onGuess = useCallback(
        (index: number, isDankGuess: boolean) => {
            // Take the amount of time the user took to swipe, turn it into seconds,
            // round it to the first decimal place...
            const difference = Math.round(((Date.now() - timerRef.current) / 1000) * 10) / 10;

            // This default multiplier is for when the timer has run out.
            let multiplier = 1;

            // If the timer (effectively) hasn't run out, then we can use our custom scoring multiplier.
            if (difference < TIMER_SECONDS - 0.05) {
                // Then convert it into a multiplier using log base 1/4 (difference) + 1.2.
                //
                // The "1.2" moves the function up enough that, over the range of 0 to 5 (i.e. timer length),
                // we don't end up with (practically) any negative numbers.
                //
                // And why use log base 1/4? Because it rewards very fast guesses and punishes slow ones.
                multiplier = Math.abs(Math.log(difference) / Math.log(1 / 4) + 1.1);
            }

            // Then calculate the final adjustment. Don't want it to go negative because of the multiplier.
            const adjustment = Math.max(BASE_SCORE * multiplier, 0);

            const isCorrect = predictions[index] === isDankGuess;

            if (isCorrect) {
                dispatch(actions.addScore(adjustment));
            } else {
                dispatch(actions.subtractScore(adjustment));
            }

            dispatch(actions.addGuess(isCorrect));

            onResetTimer();
            timerRef.current = Date.now();
        },
        [predictions, actions, dispatch, onResetTimer]
    );

    const onStartTimer = useCallback(() => {
        timerRef.current = Date.now();
    }, []);

    return {onGuess, onStartTimer};
};

export const useCardStackAnimation = (
    images: Array<string>,
    predictions: Array<boolean>,
    onGuess: (index: number, guess: boolean) => void,
    onGameOver: () => void
) => {
    // The set flags all the images that have been flicked out.
    const [removedImages] = useState(() => new Array<number>());

    const numberOfImages = images.length;

    // Create a bunch of springs using the helpers above
    const [cardSprings, api] = useSprings(numberOfImages, (i) => ({
        ...to(i, numberOfImages),
        from: from(i)
    }));

    const animateCards = useCallback(
        (top: number, isRemoved: boolean, {dir = 1, down = true, my = 0} = {}) => {
            api.start((i) => {
                if (i > top) {
                    return;
                } else if (i < top) {
                    if (isRemoved) {
                        // As cards are removed from the stack, we want to
                        // re-scale/re-shift the cards left in the stack to visually
                        // "move up" in position.
                        return {
                            x: calcShift(i + (numberOfImages - top), numberOfImages),
                            y: 0,
                            scale: calcScale(i + (numberOfImages - top), numberOfImages),
                            delay: undefined
                        };
                    }
                } else {
                    // When a card is removed, it flies out up or down,
                    // otherwise it goes back to zero.
                    const y = isRemoved ? (200 + window.innerHeight) * dir : down ? my : 0;

                    // Active cards lift up a bit.
                    const scale = down
                        ? 1.1
                        : calcScale(i + (numberOfImages - 1 - top), numberOfImages);

                    return {
                        y,
                        scale,
                        delay: undefined,
                        config: {friction: 50, tension: down ? 800 : isRemoved ? 200 : 500}
                    };
                }
            });

            if (removedImages.length === numberOfImages) {
                setTimeout(() => {
                    onGameOver();
                }, 1000);
            }
        },
        [api, numberOfImages, removedImages, onGameOver]
    );

    const guessTopImage = useCallback(
        (isDankGuess?: boolean) => {
            const top = calcTopImage(removedImages, numberOfImages);

            if (isDankGuess === undefined) {
                isDankGuess = !predictions[top];
            }

            removedImages.push(top);
            onGuess(top, isDankGuess);

            animateCards(top, true, {dir: isDankGuess ? -1 : 1});
        },
        [numberOfImages, predictions, removedImages, animateCards, onGuess]
    );

    const bind = useDrag(
        ({args: [index], down, movement: [_, my], direction: [__, yDir], velocity}) => {
            if (index !== calcTopImage(removedImages, numberOfImages)) {
                return;
            }

            // If you flick hard enough or move the image far enough up/down,
            // it should trigger the card to fly out.
            const trigger = velocity > 0.2 || Math.abs(my) > 150;

            // Direction should either be up or down.
            const dir = yDir < 0 ? -1 : 1;

            if (!down && trigger) {
                // If button/finger's up and trigger velocity is reached,
                // we flag the image ready to fly out.
                removedImages.push(index);

                onGuess(index, dir === -1);
            }

            const isRemoved = removedImages[removedImages.length - 1] === index;
            animateCards(index, isRemoved, {dir, down, my});
        }
    );

    return {cardSprings, bind, guessTopImage};
};

export const useTimerAnimation = (resetTimer: boolean, onStart: () => void, onEnd: () => void) => {
    const noParamsOnStart = useCallback(() => onStart(), [onStart]);
    const noParamsOnEnd = useCallback(() => onEnd(), [onEnd]);

    const timerStyles = useSpring({
        from: {scaleX: 1},
        to: {scaleX: 0},
        loop: true,
        config: {duration: TIMER_DURATION},
        reset: resetTimer,
        onStart: noParamsOnStart,
        onRest: noParamsOnEnd
    });

    return {timerStyles};
};

export const useScoreAnimation = () => {
    const [{state}] = useGame();

    return useSpring({from: {animatedScore: 0}, to: {animatedScore: state.score}});
};

/* Helper Stuff */

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number, total: number) => ({
    x: calcShift(i, total),
    y: 0,
    scale: calcScale(i, total),
    delay: i * 100
});

// Note: We're using `vw` for the `x` (shift) values so that they scale responsively.
const from = (_i: number) => ({x: "0vw", scale: 1.5, y: -1000});

// In order to get that "layered perspective" look, we need to scale each further card down.
//
// 0.035 is the multiplier that gives us just enough shift at the low end (small screens) but not so much
// at the high end (large screens). Yes, determined by trial and error.
const calcScale = (i: number, total: number) => 1 - (total - 1 - i) * 0.035;

// Another part of the "layered perspective" look, cards get shifted a bit to the left.
const calcShift = (i: number, total: number) => `${(total - 1 - i) * -1.8}vw`;

const calcTopImage = (removedImages: Array<number>, numberOfImages: number) => {
    return removedImages.length === 0
        ? numberOfImages - 1
        : Math.max(removedImages[removedImages.length - 1] - 1, 0);
};
