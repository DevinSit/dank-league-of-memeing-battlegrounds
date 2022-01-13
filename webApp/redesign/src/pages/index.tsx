import {useCallback, useMemo, useRef, useState} from "react";
import type {NextPage} from "next";
import Head from "next/head";
import {useSWRConfig} from "swr";
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

interface ParsedData {
    images: Array<string>;
    predictions: Array<boolean>;
    urls: Array<string>;
}

const createDefaultParsedData = (): ParsedData => ({images: [], predictions: [], urls: []});

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
    const {mutate} = useSWRConfig();

    const {data} = useSWR<{posts: Array<Post>}>(api.RANDOM_MEMES, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    });

    const parsedData = useMemo(
        () =>
            data?.posts?.reduce((acc, post) => {
                acc.images.push(post.url);
                acc.predictions.push(post.kerasPrediction >= 0.5);
                acc.urls.push(`https://www.reddit.com${post.permalink}`);

                return acc;
            }, createDefaultParsedData()) || createDefaultParsedData(),
        [data]
    );

    const fetchNewImages = useCallback(() => mutate(api.RANDOM_MEMES), [mutate]);

    usePreloadImages(parsedData.images);

    return {data: parsedData, fetchNewImages};
};

const Home: NextPage = () => {
    const [page, setPage] = useState<GamePage>(GamePage.RULES);

    const [score, setScore] = useState(0);
    const [guesses, setGuesses] = useState<Array<boolean>>([]);

    const {
        data: {images, predictions, urls},
        fetchNewImages
    } = useMemeImages();

    const customSetPage = useCallback(
        (page: GamePage) => {
            setPage((oldPage) => {
                // Fetch new images when coming into the game from the results;
                if (oldPage === GamePage.RESULTS) {
                    fetchNewImages();
                }

                // Reset the guesses/score state when going into the Game.
                if (page === GamePage.GAME) {
                    setScore(() => 0);
                    setGuesses(() => []);
                }

                return page;
            });
        },
        [fetchNewImages]
    );

    const currentPage = (() => {
        switch (page) {
            case GamePage.RULES:
                return <Rules setPage={customSetPage} />;
            case GamePage.GAME:
                return (
                    <Game
                        images={images}
                        predictions={predictions}
                        score={score}
                        setGuesses={setGuesses}
                        setPage={customSetPage}
                        setScore={setScore}
                    />
                );
            case GamePage.RESULTS:
                return (
                    <GameResults
                        guesses={guesses}
                        images={images}
                        score={score}
                        urls={urls}
                        setPage={customSetPage}
                    />
                );
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
