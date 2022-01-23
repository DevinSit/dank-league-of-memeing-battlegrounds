import type {NextPage} from "next";
import Head from "next/head";
import {Classify} from "scenes/";

const ClassifyPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Classify | Are you a Dank Memer?</title>
            </Head>

            <Classify />
        </>
    );
};

export default ClassifyPage;
