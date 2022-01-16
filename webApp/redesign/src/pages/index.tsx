import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {NextPage} from "next";
import Head from "next/head";
import {useSWRConfig} from "swr";
import {AppTitle} from "components/";
import {useGame, useSWR} from "hooks/";
import {Game, GameResults, Rules} from "scenes/";
import {Post} from "types";
import {api} from "values/api";
import {GamePage} from "values/gamePages";

interface ParsedData {
    images: Array<string>;
    posts: Record<string, Post>;
    predictions: Array<boolean>;
}

const createDefaultParsedData = (): ParsedData => ({images: [], posts: {}, predictions: []});

const usePreloadImages = (urls: Array<string>): Array<string> => {
    const [images, setImages] = useState<Array<string>>([]);
    const imagesRef = useRef<Array<HTMLImageElement>>([]);

    useEffect(() => {
        const newImages: Array<string> = [];
        imagesRef.current = [];

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];

            // Trick for preloading images. Keep them in an array so that they don't unload.
            // https://stackoverflow.com/questions/3646036/preloading-images-with-javascript
            const image = new Image();

            image.onload = () => {
                if (newImages.length < 10 && !newImages.includes(url)) {
                    newImages.push(url);
                    imagesRef.current.push(image);
                }

                if (newImages.length === 10) {
                    setImages(newImages);
                }
            };

            image.src = url;
        }
    }, [urls]);

    return images;
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

                acc.posts[post.url] = post;

                return acc;
            }, createDefaultParsedData()) || createDefaultParsedData(),
        [data]
    );

    const fetchNewImages = useCallback(() => mutate(api.RANDOM_MEMES), [mutate]);

    const images = usePreloadImages(parsedData.images);

    const finalParsedData = useMemo(() => {
        const posts = images.map((image) => parsedData.posts[image]);

        return {images, posts, predictions: parsedData.predictions};
    }, [parsedData, images]);

    return {data: finalParsedData, fetchNewImages};
};

const Home: NextPage = () => {
    const [{state, dispatch}, actions] = useGame();

    const {
        data: {images, predictions, posts},
        fetchNewImages
    } = useMemeImages();

    const setPage = useCallback(
        (page: GamePage) => {
            // Fetch new images when coming into the game from the results;
            if (state.page === GamePage.RESULTS) {
                fetchNewImages();
            }

            dispatch(actions.setPage(page));
        },
        [state.page, actions, dispatch, fetchNewImages]
    );

    const currentPage = (() => {
        switch (state.page) {
            case GamePage.RULES:
                return <Rules setPage={setPage} />;
            case GamePage.GAME:
                return <Game images={images} predictions={predictions} setPage={setPage} />;
            case GamePage.RESULTS:
                return <GameResults posts={posts} setPage={setPage} />;
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
