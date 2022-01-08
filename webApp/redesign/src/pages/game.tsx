import type {NextPage} from "next";
import Head from "next/head";
import {BACKEND_URL} from "config";
import {AppTitle} from "components/";
import {Game} from "scenes/";

const GamePage: NextPage = ({memes}: any) => {
    console.log({memes});

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

export const getServerSideProps = async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/memes/random`);
    const memes = await res.json();

    return {
        props: {
            memes
        }
    };
};

export default GamePage;
