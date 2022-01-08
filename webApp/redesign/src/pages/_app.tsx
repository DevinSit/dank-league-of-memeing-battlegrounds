import type {AppProps} from "next/app";
import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {AppNavigation} from "components/";
import {ScreenUrls} from "values/screenUrls";
import "styles/global.scss";

// "Game Mode" is just a fancy way of saying that we need to add a class to `body`
// when playing the game so as to disable overflow.
const useGameMode = () => {
    const router = useRouter();

    useEffect(() => {
        if (router.pathname === ScreenUrls.GAME) {
            document.body.classList.add("game-mode");
            document.body.classList.remove("browse-mode");
        } else if (router.pathname === ScreenUrls.BROWSE) {
            document.body.classList.add("browse-mode");
            document.body.classList.remove("game-mode");
        } else {
            document.body.classList.remove("game-mode");
            document.body.classList.remove("browse-mode");
        }
    }, [router.pathname]);
};

function MyApp({Component, pageProps}: AppProps) {
    useGameMode();

    return (
        <>
            <Head>
                <meta name="description" content="Built by Devin Sit" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />;
            <AppNavigation />
        </>
    );
}

export default MyApp;
