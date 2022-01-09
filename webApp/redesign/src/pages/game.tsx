import type {NextPage} from "next";
import Head from "next/head";
import {AppTitle} from "components/";
import {Game} from "scenes/";

const GamePage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Play | Are you a Dank Memer?</title>
            </Head>

            <AppTitle />

            <Game />
        </>
    );
};

export default GamePage;
