import classNames from "classnames";
import {useState} from "react";
import {useSprings, animated, to as interpolate} from "@react-spring/web";
import {useDrag} from "react-use-gesture";

import styles from "./MemeCards.module.scss";

const cards = [
    "https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg",
    "https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg",
    "https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg",
    "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg",
    "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg",
    "https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg",
    "https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg",
    "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg",
    "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg",
    "https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg"
];

interface MemeCardsProps {
    className?: string;
}

const MemeCards = ({className}: MemeCardsProps) => {
    // The set flags all the cards that are flicked out
    const [gone] = useState(() => new Set());

    // Create a bunch of springs using the helpers above
    const [props, api] = useSprings(cards.length, (i) => ({...to(i), from: from(i)}));

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
                            x: calcShift(i + (cards.length - index)),
                            y: 0,
                            scale: calcScale(i + (cards.length - index)),
                            delay: undefined
                        };
                    }
                } else {
                    // When a card is gone it flies out up or down,
                    // otherwise it goes back to zero.
                    const y = isGone ? (200 + window.innerWidth) * dir : down ? my : 0;

                    // Active cards lift up a bit.
                    const scale = down ? 1.1 : calcScale(i + (cards.length - 1 - index));

                    return {
                        y,
                        scale,
                        delay: undefined,
                        config: {friction: 50, tension: down ? 800 : isGone ? 200 : 500}
                    };
                }
            });

            if (!down && gone.size === cards.length) {
                setTimeout(() => {
                    gone.clear();
                    api.start((i) => to(i));
                }, 600);
            }
        }
    );

    return (
        <div className={className}>
            {props.map(({x, y, scale}, i) => (
                <animated.div
                    className={classNames(styles.MemeCardContainer)}
                    key={i}
                    style={{x, y}}
                >
                    {/* This is the card itself, we're binding our gesture to it (and
                        inject its index so we know which is which) */}
                    <animated.div
                        {...bind(i)}
                        className={styles.MemeCard}
                        style={{
                            transform: interpolate([scale], trans),
                            backgroundImage: `url(${cards[i]})`
                        }}
                    />
                </animated.div>
            ))}
        </div>
    );
};

export default MemeCards;

/* Helper Stuff */

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
    x: calcShift(i),
    y: 0,
    scale: calcScale(i),
    delay: i * 100
});

const from = (_i: number) => ({x: 0, scale: 1.5, y: -1000});

// This is being used down there in the view, it interpolates scale into a css transform
const trans = (s: number) => `scale(${s})`;

// In order to get that "layered perspective" look, we need to scale each further
// card down. Here, 0.03 is the scaling factor.
const calcScale = (i: number) => 1 - (cards.length - 1 - i) * 0.03;
// const calcScale = (i: number) => 1;

// Another part of the "layered perspective" look, cards get shifted a bit to the left.
const calcShift = (i: number) => (cards.length - 1 - i) * -16;
