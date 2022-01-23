import type {NextPage} from "next";
import Head from "next/head";
import {useGame, useSWR} from "hooks/";
import {Leaderboard} from "scenes/";
import type {Leaderboard as LeaderboardType, UserRank} from "types";
import {api} from "values/api";

const LeaderboardPage: NextPage = () => {
    const [
        {
            state: {username}
        }
    ] = useGame();

    const {data} = useSWR<{leaderboard: LeaderboardType; rank: UserRank}>(
        `${api.LEADERBOARD}/${username}`
    );

    return (
        <>
            <Head>
                <title>Leaderboard | Dank League of Memeing Battlegrounds</title>
            </Head>

            <Leaderboard
                leaderboard={data?.leaderboard || []}
                userRank={data?.rank || {rank: 0, score: 0, username}}
            />
        </>
    );
};

export default LeaderboardPage;
