import type {NextPage} from "next";
import Head from "next/head";
import {Browse} from "scenes/";
import type {Post} from "types";
import {api} from "values/api";

interface BrowsePageProps {
    posts: Array<Post>;
}

const BrowsePage: NextPage<BrowsePageProps> = ({posts = []}) => (
    <>
        <Head>
            <title>Browse | Are you a Dank Memer?</title>
        </Head>

        <Browse posts={posts} />
    </>
);

export async function getServerSideProps() {
    const response = await fetch(api.serverSide.LATEST_MEMES);
    const data: {posts: Array<Post>} = await response.json();

    return {
        props: {
            posts: data.posts
        }
    };
}

export default BrowsePage;
