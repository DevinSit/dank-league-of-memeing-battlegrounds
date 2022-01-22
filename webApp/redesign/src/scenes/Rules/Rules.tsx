import {Button} from "components/";
import {GamePage} from "values/gamePages";
import styles from "./Rules.module.scss";

interface RulesProps {
    setPage: (page: GamePage) => void;
}

const Rules = ({setPage}: RulesProps) => {
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

                <div className={styles.RulesCardButtonContainer}>
                    <Button onClick={() => setPage(GamePage.GAME)}>Play</Button>
                </div>
            </div>
        </div>
    );
};

export default Rules;
