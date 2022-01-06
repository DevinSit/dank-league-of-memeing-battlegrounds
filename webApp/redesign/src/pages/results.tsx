import type {NextPage} from "next";
import Head from "next/head";
import {AppNavigation} from "components/";
import {GameResults} from "scenes/";

const GameResultsPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Are you a Dank Memer?</title>
                <meta name="description" content="Built by Devin Sit" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <GameResults />

            <AppNavigation />
        </>
    );
};

export default GameResultsPage;
