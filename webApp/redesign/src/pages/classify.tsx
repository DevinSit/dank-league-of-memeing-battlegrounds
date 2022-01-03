import type {NextPage} from "next";
import Head from "next/head";
import {AppNavigation} from "components/";
import {Classify} from "scenes/";

const ClassifyPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Are you a Dank Memer?</title>
                <meta name="description" content="Built by Devin Sit" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Classify />

            <AppNavigation />
        </>
    );
};

export default ClassifyPage;
