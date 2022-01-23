import type {NextPage} from "next";
import Head from "next/head";
import {useSWR} from "hooks/";
import {Browse} from "scenes/";
import type {Post} from "types";
import {api} from "values/api";

const BrowsePage: NextPage = () => {
    const {data} = useSWR<{posts: Array<Post>}>(api.LATEST_MEMES);

    return (
        <>
            <Head>
                <title>Browse | Are you a Dank Memer?</title>
            </Head>

            <Browse posts={data?.posts || []} />
        </>
    );
};

export default BrowsePage;
