import {useEffect, useMemo, useState} from "react";
import {animated, useSpring} from "@react-spring/web";
import {Button} from "components/";
import {ValueFormatting} from "services/";
import {GamePage} from "values/gamePages";
import styles from "./Rules.module.scss";

interface RulesProps {
    setPage: (page: GamePage) => void;
}

const Rules = ({setPage}: RulesProps) => {
    const [adjustments, setAdjustments] = useState<Array<number>>([]);

    useEffect(() => {
        setInterval(() => {
            setAdjustments((old) => {
                if (old.length < 10) {
                    return [...old, 10000 * Math.random()];
                }

                return old;
            });
        }, 1000);
    }, []);

    return (
        <div className={styles.Rules}>
            <div className={styles.RulesCard}>
                <h2 className={styles.RulesCardHeader}>Rules</h2>

                <ol className={styles.RulesCardList}>
                    <li>You are given 10 memes.</li>
                    <li>You must guess if they are dank or not by swiping up or down.</li>
                    <li>Gain points by guessing correctly.</li>
                    <li>Lose points by guessing wrong.</li>
                    <li>More points are gained/lost for guessing as fast as possible.</li>
                    <li>Have fun!</li>
                </ol>

                <div className={styles.Container}>
                    {adjustments.map((adjustment, index) => (
                        <AnimatedAdjustment
                            key={index}
                            adjustment={adjustment}
                            hold={index === 0}
                            index={index}
                        />
                    ))}
                </div>

                <div className={styles.RulesCardButtonContainer}>
                    <Button onClick={() => setPage(GamePage.GAME)}>Play</Button>
                </div>
            </div>
        </div>
    );
};

export default Rules;

interface AnimatedAdjustmentProps {
    adjustment?: number;
    hold?: boolean;
    index?: number;
}

const AnimatedAdjustment = ({
    adjustment = 1230,
    hold = false,
    index = 0
}: AnimatedAdjustmentProps) => {
    const [done, setDone] = useState(false);

    const seed = useMemo(() => Math.random(), []);
    const direction = useMemo(() => (seed < 0.5 ? -1 : 1), [seed]);

    const from = useMemo(() => calcFrom(seed, direction), [seed, direction]);
    const to = useMemo(
        () => calcTo(seed, direction, adjustment, index),
        [seed, direction, adjustment, index]
    );

    const style = useSpring({
        from: hold ? {x: 0, y: 0} : from,
        to: hold ? {x: 0, y: 0} : to,
        delay: 200
    });

    useEffect(() => {
        // setTimeout(() => {
        //     setDone(true);
        // }, 4000);
    }, []);

    return !done ? (
        <animated.p className={styles.AnimatedAdjustment} style={style}>
            {adjustment > 0 ? "+" : "-"}
            {ValueFormatting.formatScore(Math.abs(adjustment))}
        </animated.p>
    ) : null;
};

const calcFrom = (seed: number, direction: number) => {
    return {x: 100 * seed * direction, y: 0, opacity: 0.5, rotate: 0, scale: 1};
};

const calcTo = (seed: number, direction: number, adjustment: number, index: number) => {
    const quadrant = (() => {
        if (index % 4 === 0) {
            return -150;
        } else if (index % 4 === 1) {
            return -75;
        } else if (index % 4 === 2) {
            return 0;
        } else if (index % 4 === 3) {
            return 75;
        } else {
            return 175;
        }
    })();

    return {
        x: quadrant + 40 * (seed + 1) * direction,
        y: -120 - 100 * Math.random(),
        opacity: 1,
        rotate: (5 + 3 * Math.random()) * direction,
        scale: scaleValue(adjustment, [0, 10000], [70, 160]) / 100
    };
};

// https://gist.github.com/fpillet/993002
function scaleValue(value: number, from: [number, number], to: [number, number]): number {
    var scale = (to[1] - to[0]) / (from[1] - from[0]);
    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return ~~(capped * scale + to[0]);
}
