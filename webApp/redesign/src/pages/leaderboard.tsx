import type {NextPage} from "next";
import Head from "next/head";
import {Leaderboard} from "scenes/";
import type {Leaderboard as LeaderboardType} from "types";
import {api} from "values/api";

interface LeaderboardPageProps {
    leaderboard: LeaderboardType;
}

const LeaderboardPage: NextPage<LeaderboardPageProps> = ({leaderboard = []}) => (
    <>
        <Head>
            <title>Leaderboard | Are you a Dank Memer?</title>
        </Head>

        <Leaderboard leaderboard={leaderboard} />
    </>
);

export async function getServerSideProps() {
    let leaderboard: LeaderboardType = [];

    try {
        const response = await fetch(api.LEADERBOARD);
        const leaderboard = (await response.json()).leaderboard;

        return {props: {leaderboard}};
    } catch {
        return {props: {leaderboard}};
    }
}

export default LeaderboardPage;
