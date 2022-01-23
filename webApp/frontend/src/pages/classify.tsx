import type {NextPage} from "next";
import Head from "next/head";
import {Classify} from "scenes/";

const ClassifyPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Classify | Dank League of Memeing Battlegrounds</title>
            </Head>

            <Classify />
        </>
    );
};

export default ClassifyPage;
