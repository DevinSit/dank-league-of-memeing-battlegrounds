import ReactDropzone from "react-dropzone";
import styles from "./Classify.module.scss";

const Classify = () => (
    <div className={styles.Classify}>
        <h1 className={styles.ClassifyHeader}>Classify Your Own</h1>

        <div className={styles.ClassifyContent}>
            <ReactDropzone accept="image/jpeg, image/png" className={styles.ClassifyDropzone}>
                <div className={styles.ClassifyDropzoneText}>Upload a meme (jpeg, png)</div>
            </ReactDropzone>

            <div className={styles.ClassifyMemeContainer}>
                <div className={styles.ClassifyMeme}></div>

                <div className={styles.ClassifyPredictionContainer}>
                    <p className={styles.ClassifyPredictionHeader}>Prediction</p>
                    <p className={styles.ClassifyPrediction}>Dank</p>
                </div>
            </div>
        </div>

        <div className={styles.MobileSpacer} />
    </div>
);

export default Classify;
