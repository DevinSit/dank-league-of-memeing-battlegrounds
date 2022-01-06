import type {NextPage} from "next";
import Head from "next/head";
import {AppNavigation} from "components/";
import {Browse} from "scenes/";

const BrowsePage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Are you a Dank Memer?</title>
                <meta name="description" content="Built by Devin Sit" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Browse />

            <AppNavigation />
        </>
    );
};

export default BrowsePage;
