import type {NextPage} from "next";
import Head from "next/head";
import {AppTitle} from "components/";
import {Rules} from "scenes/";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Are you a Dank Memer?</title>
            </Head>

            <AppTitle />

            <Rules />
        </>
    );
};

export default Home;
