import type {AppProps} from "next/app";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {ScreenUrls} from "values/screenUrls";
import "styles/global.scss";

// "Game Mode" is just a fancy way of saying that we need to add a class to `body`
// when playing the game so as to disable overflow.
const useGameMode = () => {
    const router = useRouter();

    useEffect(() => {
        if (router.pathname === ScreenUrls.GAME) {
            document.body.classList.add("game-mode");
        } else {
            document.body.classList.remove("game-mode");
        }
    }, [router.pathname]);
};

function MyApp({Component, pageProps}: AppProps) {
    useGameMode();

    return <Component {...pageProps} />;
}

export default MyApp;
