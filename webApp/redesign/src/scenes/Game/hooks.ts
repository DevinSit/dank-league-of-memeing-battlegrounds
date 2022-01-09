import {useCallback, useMemo, useRef, useState} from "react";
import {useSpring, useSprings} from "@react-spring/web";
import {useDrag} from "react-use-gesture";

export const useScore = (predictions: Array<boolean>, onResetTimer: () => void) => {
    const timerRef = useRef<number>(Date.now());
    const [score, setScore] = useState(0);

    const onGuess = useCallback(
        (index: number, isDankGuess: boolean) => {
            const difference = Date.now() - timerRef.current;

            if (predictions[index] === isDankGuess) {
                setScore((oldScore) => oldScore + 10000);
            } else {
                setScore((oldScore) => Math.max(0, oldScore - 10000));
            }

            onResetTimer();
        },
        [predictions, onResetTimer]
    );

    const onStartTimer = useCallback(() => {
        timerRef.current = Date.now();
    }, []);

    return {score, onGuess, onStartTimer};
};

export const useCardStackAnimation = (
    images: Array<string>,
    onGuess: (index: number, guess: boolean) => void
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
                    removedImages.length = 0;
                    api.start((i) => to(i, numberOfImages));
                }, 600);
            }
        },
        [api, numberOfImages, removedImages]
    );

    const removeTopImage = useCallback(() => {
        const top = calcTop(removedImages, numberOfImages);

        removedImages.push(top);
        onGuess(top, false);

        animateCards(top, true, {dir: 1});
    }, [numberOfImages, removedImages, animateCards, onGuess]);

    // Create a gesture, we're interested in down-state,
    // delta(current - pos - click - pos), direction and velocity.
    const bind = useDrag(
        ({args: [index], down, movement: [_, my], direction: [__, yDir], velocity}) => {
            if (index !== calcTop(removedImages, numberOfImages)) {
                return;
            }

            // If you flick hard enough or move the card far enough up/down,
            // it should trigger the card to fly out.
            const trigger = velocity > 0.2 || Math.abs(my) > 150;

            // Direction should either point up or down.
            const dir = yDir < 0 ? -1 : 1;

            if (!down && trigger) {
                // If button/finger's up and trigger velocity is reached,
                // we flag the card ready to fly out.
                removedImages.push(index);

                onGuess(index, dir === -1);
            }

            const isRemoved = removedImages[removedImages.length - 1] === index;
            animateCards(index, isRemoved, {dir, down, my});
        }
    );

    return {cardSprings, bind, removeTopImage};
};

export const useTimerAnimation = (resetTimer: boolean, onStart: () => void, onEnd: () => void) => {
    const timerStyles = useSpring({
        from: {scaleX: 1},
        to: {scaleX: 0},
        loop: true,
        config: {duration: 5000},
        reset: resetTimer,
        onStart: onStart,
        onRest: onEnd
    });

    return {timerStyles};
};

export const useScoreAnimation = (score: number) => {
    const {animatedScore} = useSpring({from: {animatedScore: 0}, to: {animatedScore: score}});

    return {animatedScore};
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
const calcScale = (i: number, total: number) => 1 - (total - 1 - i) * 0.035;

// Another part of the "layered perspective" look, cards get shifted a bit to the left.
const calcShift = (i: number, total: number) => `${(total - 1 - i) * -1.8}vw`;

const calcTop = (removedImages: Array<number>, numberOfImages: number) => {
    return removedImages.length === 0
        ? numberOfImages - 1
        : Math.max(removedImages[removedImages.length - 1] - 1, 0);
};
