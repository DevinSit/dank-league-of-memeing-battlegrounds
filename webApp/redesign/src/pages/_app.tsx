import type {AppProps} from "next/app";
import Head from "next/head";
import {AppNavigation} from "components/";
import {GameProvider} from "hooks/";
import "styles/global.scss";

const MyApp = ({Component, pageProps}: AppProps) => (
    <>
        <Head>
            <meta name="description" content="Built by Devin Sit" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <GameProvider>
            <Component {...pageProps} />
            <AppNavigation />
        </GameProvider>
    </>
);

export default MyApp;
