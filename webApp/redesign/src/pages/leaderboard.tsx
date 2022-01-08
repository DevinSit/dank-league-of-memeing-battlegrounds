import type {NextPage} from "next";
import Head from "next/head";
import {Leaderboard} from "scenes/";

const LeaderboardPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Leaderboard | Are you a Dank Memer?</title>
            </Head>

            <Leaderboard />
        </>
    );
};

export default LeaderboardPage;
