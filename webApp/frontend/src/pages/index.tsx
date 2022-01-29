import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {NextPage} from "next";
import Head from "next/head";
import {useSWRConfig} from "swr";
import {AppTitle} from "components/";
import {useGame, useSWR} from "hooks/";
import {Game, GameResults, Rules} from "scenes/";
import {ValueFormatting} from "services/";
import {Post} from "types";
import {api} from "values/api";
import {GamePage} from "values/gamePages";

interface ParsedData {
    images: Array<string>;
    posts: Record<string, Post>;
}

const createDefaultParsedData = (): ParsedData => ({images: [], posts: {}});

const usePreloadImages = (urls: Array<string>, posts: Record<string, Post>): Array<string> => {
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

            image.onload = function () {
                // Max tier jank. Because Reddit returns that 'error' image when an image is 404,
                // `image.onerror` never fires. But we know the dimensions of that 'error' image are
                // 130x60, so we can check for that in the returned image to indicate that an image is 404.
                // @ts-ignore
                if (this.height === 60 && this.width === 130) {
                    fetch(`${api.MARK_MISSING_MEME}/${posts[url].id}`);
                } else {
                    if (newImages.length < 10 && !newImages.includes(url)) {
                        newImages.push(url);
                        imagesRef.current.push(image);
                    }

                    if (newImages.length === 10) {
                        setImages(newImages);
                    }
                }
            };

            image.src = url;
        }
    }, [posts, urls]);

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
                acc.posts[post.url] = post;

                return acc;
            }, createDefaultParsedData()) || createDefaultParsedData(),
        [data]
    );

    const fetchNewImages = useCallback(() => mutate(api.RANDOM_MEMES), [mutate]);

    const images = usePreloadImages(parsedData.images, parsedData.posts);

    const finalParsedData = useMemo(() => {
        const posts = images.map((image) => parsedData?.posts?.[image] || {});

        const predictions = images.map((image) =>
            ValueFormatting.booleanizePrediction(parsedData?.posts?.[image]?.kerasPrediction)
        );

        return {images, posts, predictions};
    }, [parsedData, images]);

    return {data: finalParsedData, fetchNewImages};
};

const Home: NextPage = () => {
    const hasRenderedRef = useRef<boolean>(false);
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

    useEffect(() => {
        // Fetch new images when coming into the game from clicking the game button in AppNavigation.
        if (state.page === GamePage.RULES && hasRenderedRef.current) {
            fetchNewImages();
        }

        hasRenderedRef.current = true;
    }, [state.page, fetchNewImages]);

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
                <title>Dank League of Memeing Battlegrounds</title>
            </Head>

            <AppTitle />

            {currentPage}
        </>
    );
};

export default Home;
