import type {NextPage} from "next";
import Head from "next/head";
import {Browse} from "scenes/";

const BrowsePage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Browse | Are you a Dank Memer?</title>
            </Head>

            <Browse />
        </>
    );
};

export default BrowsePage;
