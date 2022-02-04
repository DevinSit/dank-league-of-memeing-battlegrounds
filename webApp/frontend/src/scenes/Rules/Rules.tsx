import {useCallback, useEffect, useState} from "react";
import {animated, useSpring} from "@react-spring/web";
import {Button} from "components/";
import {GamePage} from "values/gamePages";
import styles from "./Rules.module.scss";

interface RulesProps {
    images: Array<string>;
    setPage: (page: GamePage) => void;
}

const Rules = ({images = [], setPage}: RulesProps) => {
    const [clickedPlay, setClickedPlay] = useState(false);
    const [waitingForImages, setWaitingForImages] = useState(false);

    const [showSecondWaitingMessage, setShowSecondWaitingMessage] = useState(false);
    const [showThirdWaitingMessage, setShowThirdWaitingMessage] = useState(false);

    const ruleCardSpring = useSpring({from: {y: 500, scale: 0.7}, to: {y: 0, scale: 1}});

    useEffect(() => {
        if (images.length !== 0) {
            setWaitingForImages(false);

            if (clickedPlay) {
                setPage(GamePage.GAME);
            }
        }
    }, [clickedPlay, images, setPage]);

    const finalSetPage = useCallback(() => {
        if (images.length === 0) {
            setWaitingForImages(true);

            setTimeout(() => {
                setShowSecondWaitingMessage(true);
            }, 4000);

            setTimeout(() => {
                setShowThirdWaitingMessage(true);
            }, 8000);
        } else {
            setPage(GamePage.GAME);
        }

        setClickedPlay(true);
    }, [images, setPage]);

    return (
        <div className={styles.Rules}>
            {waitingForImages && (
                <div className={styles.CountdownOverlay}>
                    <div className={styles.NagMessageContainer}>
                        <p className={styles.NagMessage}>Waiting for Cloud Run to wake up...</p>

                        {showSecondWaitingMessage && (
                            <p className={styles.NagMessage}>Any second now...</p>
                        )}

                        {showThirdWaitingMessage && (
                            <p className={styles.NagMessage}>
                                It&apos;s not my fault the boot times are slow...
                            </p>
                        )}
                    </div>
                </div>
            )}

            <animated.div className={styles.RulesCard} style={ruleCardSpring}>
                <h2 className={styles.RulesCardHeader}>Rules</h2>

                <ol className={styles.RulesCardList}>
                    <li>You are given 10 memes.</li>
                    <li>You must guess if they are dank or not by swiping up or down.</li>
                    <li>Gain points by guessing correctly.</li>
                    <li>Lose points by guessing incorrectly.</li>
                    <li>More points are gained/lost for guessing as fast as possible.</li>
                    <li>Have fun!</li>
                </ol>

                <div className={styles.RulesCardButtonContainer}>
                    <Button onClick={finalSetPage}>Play</Button>
                </div>
            </animated.div>
        </div>
    );
};

export default Rules;
