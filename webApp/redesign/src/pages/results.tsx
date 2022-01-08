import type {NextPage} from "next";
import Head from "next/head";
import {GameResults} from "scenes/";

const GameResultsPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Results | Are you a Dank Memer?</title>
            </Head>

            <GameResults />
        </>
    );
};

export default GameResultsPage;
