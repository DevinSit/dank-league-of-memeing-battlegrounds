import axios from "axios";
import Image from "next/image";
import {useCallback, useState} from "react";
import ReactDropzone from "react-dropzone";
import Spinner from "assets/images/loading.gif";
import {MobileSpacer} from "components/";
import {api} from "values/api";
import styles from "./Classify.module.scss";

const Classify = () => {
    const [{file, loading, prediction}, setState] = useState({
        loading: false,
        file: "" as any,
        prediction: null
    });

    const onImageDrop = useCallback(async (files) => {
        if (files.length === 0) {
            return;
        }

        setState((state) => ({...state, loading: true}));

        // Read in the image file
        const reader = new FileReader();
        const file = files[0];
        reader.readAsDataURL(file);

        // Once the file is loaded, add it to state so that it can be shown in the preview.
        reader.onloadend = () => {
            setState((state) => ({...state, file: reader.result}));
        };

        // Prepare the file to be sent to the backend
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(api.PREDICT_MEME, formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });

        const {prediction, status} = response.data;

        // Time to show the user the prediction
        if (status === "success") {
            setState((state) => ({...state, prediction, loading: false}));
        }
    }, []);

    return (
        <div className={styles.Classify}>
            <h1 className={styles.ClassifyHeader}>Classify Your Own</h1>

            <div className={styles.ClassifyContent}>
                <ReactDropzone
                    className={styles.ClassifyDropzone}
                    accept="image/jpeg, image/png"
                    onDrop={onImageDrop}
                >
                    <div className={styles.ClassifyDropzoneText}>Upload a meme (jpeg, png)</div>
                </ReactDropzone>

                <div className={styles.ClassifyMemeContainer}>
                    {file ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={styles.ClassifyMeme} src={file} alt="meme" />
                    ) : (
                        <div className={styles.ClassifyMeme}>Preview</div>
                    )}

                    <div className={styles.ClassifyPredictionContainer}>
                        {loading ? (
                            <Image src={Spinner} alt="Loading spinner" />
                        ) : (
                            <>
                                <p className={styles.ClassifyPredictionHeader}>Prediction</p>

                                {prediction ? (
                                    <p className={styles.ClassifyPrediction}>
                                        {prediction > 0.5 ? "Dank" : "Not Dank"}
                                    </p>
                                ) : (
                                    <p className={styles.ClassifyPredictionNull}>N/A</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <MobileSpacer />
        </div>
    );
};

export default Classify;
