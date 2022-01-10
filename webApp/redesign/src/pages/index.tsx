import {useMemo, useRef, useState} from "react";
import type {NextPage} from "next";
import Head from "next/head";
import {AppTitle} from "components/";
import {useSWR} from "hooks/";
import {Game, GameResults, Rules} from "scenes/";
import {api} from "values/api";
import {GamePage} from "values/gamePages";

interface Post {
    author: string;
    createdUTC: number;
    id: string;
    imageHash: string;
    kerasPrediction: number;
    permalink: string;
    score: number;
    subreddit: string;
    title: string;
    url: string;
}

const usePreloadImages = (images: Array<string>) => {
    const imagesRef = useRef<Array<HTMLImageElement>>([]);

    useMemo(() => {
        imagesRef.current = [];

        for (const url of images) {
            // Trick for preloading images. Keep them in an array so that they don't unload.
            // https://stackoverflow.com/questions/3646036/preloading-images-with-javascript
            const image = new Image();
            image.src = url;

            imagesRef.current.push(image);
        }
    }, [images]);
};

const useMemeImages = () => {
    const {data} = useSWR<{posts: Array<Post>}>(api.RANDOM_MEMES, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    });

    const images = useMemo(() => data?.posts?.map(({url}) => url), [data]) || [];

    const predictions =
        useMemo(() => data?.posts?.map(({kerasPrediction}) => kerasPrediction >= 0.5), [data]) ||
        [];

    usePreloadImages(images);

    return {images, predictions};
};

const Home: NextPage = () => {
    const [page, setPage] = useState<GamePage>(GamePage.RULES);

    const {images, predictions} = useMemeImages();

    const currentPage = (() => {
        switch (page) {
            case GamePage.RULES:
                return <Rules setPage={setPage} />;
            case GamePage.GAME:
                return <Game images={images} predictions={predictions} setPage={setPage} />;
            case GamePage.RESULTS:
                return <GameResults images={images} setPage={setPage} />;
        }
    })();

    return (
        <>
            <Head>
                <title>Are you a Dank Memer?</title>
            </Head>

            <AppTitle />

            {currentPage}
        </>
    );
};

export default Home;
