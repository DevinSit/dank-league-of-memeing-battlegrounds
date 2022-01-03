import type {NextPage} from "next";
import Head from "next/head";
import {AppNavigation, AppTitle} from "components/";
import {Leaderboard} from "scenes/";

const LeaderboardPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Are you a Dank Memer?</title>
                <meta name="description" content="Built by Devin Sit" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <AppTitle />

            <Leaderboard />

            <AppNavigation />
        </>
    );
};

export default LeaderboardPage;
