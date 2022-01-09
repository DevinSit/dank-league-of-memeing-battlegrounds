import {useState} from "react";
import {useSpring, useSprings} from "@react-spring/web";
import {useDrag} from "react-use-gesture";

export const useScore = () => {
    const [score, setScore] = useState(0);

    const onCorrectGuess = () => {
        setScore((oldScore) => oldScore + 10000);
    };

    const onWrongGuess = () => {
        setScore((oldScore) => Math.max(0, oldScore - 10000));
    };

    return {score, onCorrectGuess, onWrongGuess};
};

export const useCardStackAnimation = (
    images: Array<string>,
    onCorrectGuess: () => void,
    onWrongGuess: () => void
) => {
    const numberOfImages = images.length;

    // The set flags all the cards that are flicked out
    const [gone] = useState(() => new Set());

    // Create a bunch of springs using the helpers above
    const [cardSprings, api] = useSprings(numberOfImages, (i) => ({
        ...to(i, numberOfImages),
        from: from(i)
    }));

    // Create a gesture, we're interested in down-state,
    // delta(current - pos - click - pos), direction and velocity.
    const bind = useDrag(
        ({args: [index], down, movement: [_, my], direction: [__, yDir], velocity}) => {
            // If you flick hard enough or move the card far enough up/down,
            // it should trigger the card to fly out.
            const trigger = velocity > 0.2 || Math.abs(my) > 150;

            // Direction should either point up or down.
            const dir = yDir < 0 ? -1 : 1;

            if (!down && trigger) {
                // If button/finger's up and trigger velocity is reached,
                // we flag the card ready to fly out.
                gone.add(index);

                if (dir === -1) {
                    onCorrectGuess();
                } else if (dir === 1) {
                    onWrongGuess();
                }
            }

            api.start((i) => {
                if (i > index) {
                    return;
                }

                const isGone = gone.has(index);

                if (i < index) {
                    if (isGone) {
                        // As cards are removed from the stack, we want to
                        // re-scale/re-shift the cards left in the stack to visually
                        // "move up" in position.
                        return {
                            x: calcShift(i + (numberOfImages - index), numberOfImages),
                            y: 0,
                            scale: calcScale(i + (numberOfImages - index), numberOfImages),
                            delay: undefined
                        };
                    }
                } else {
                    // When a card is gone it flies out up or down,
                    // otherwise it goes back to zero.
                    const y = isGone ? (200 + window.innerWidth) * dir : down ? my : 0;

                    // Active cards lift up a bit.
                    const scale = down
                        ? 1.1
                        : calcScale(i + (numberOfImages - 1 - index), numberOfImages);

                    return {
                        y,
                        scale,
                        delay: undefined,
                        config: {friction: 50, tension: down ? 800 : isGone ? 200 : 500}
                    };
                }
            });

            if (!down && gone.size === numberOfImages) {
                setTimeout(() => {
                    gone.clear();
                    api.start((i) => to(i, numberOfImages));
                }, 600);
            }
        }
    );

    return {bind, cardSprings};
};

export const useTimerAnimation = () => {
    const timerStyles = useSpring({
        from: {scaleX: 1},
        to: {scaleX: 0},
        loop: true,
        config: {duration: 5000}
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

// This is being used down there in the view, it interpolates scale into a css transform
const trans = (s: number) => `scale(${s})`;

// In order to get that "layered perspective" look, we need to scale each further card down.
const calcScale = (i: number, total: number) => 1 - (total - 1 - i) * 0.035;

// Another part of the "layered perspective" look, cards get shifted a bit to the left.
const calcShift = (i: number, total: number) => `${(total - 1 - i) * -1.8}vw`;
