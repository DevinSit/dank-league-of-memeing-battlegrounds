import styles from "./Rules.module.scss";

const Rules = () => (
    <div className={styles.Rules}>
        <h1 className={styles.DankMemerTitle}>Are you a Dank Memer?</h1>

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
                <button className={styles.RulesCardButton}>Play</button>
            </div>
        </div>
    </div>
);

export default Rules;
