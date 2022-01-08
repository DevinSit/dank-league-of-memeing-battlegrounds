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
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Browse />

            <AppNavigation />
        </>
    );
};

export default BrowsePage;
