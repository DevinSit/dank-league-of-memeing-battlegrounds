import {MobileSpacer} from "components/";
import type {Post as PostType} from "types";
import styles from "./Browse.module.scss";

interface BrowseProps {
    posts: Array<PostType>;
}

const Browse = ({posts = []}: BrowseProps) => (
    <div className={styles.Browse}>
        <h1 className={styles.BrowseHeader}>Latest from r/dankmemes</h1>

        <main className={styles.BrowseContent}>
            <div className={styles.BrowsePosts}>
                {posts.map((post) => (
                    <Post key={post.id} {...post} />
                ))}
            </div>

            <MobilePosts posts={posts} />

            <PostDetails />
        </main>

        <MobileSpacer />
    </div>
);

export default Browse;

/* Other Components */

interface PostProps {
    author: string;
    createdUtc: number;
    title: string;
    url: string;
}

const Post = ({author, createdUtc, title, url}: PostProps) => (
    <div className={styles.Post}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.PostImage} src={url} alt={title} />

        <div className={styles.PostContent}>
            <h2 className={styles.PostTitle}>{title}</h2>
            <p className={styles.PostAuthor}>Posted by {author}</p>
            <p className={styles.PostTimestamp}>{getCreatedTimeAgo(createdUtc)}</p>
        </div>
    </div>
);

interface MobilePostsProps {
    posts: Array<PostType>;
}

const MobilePosts = ({posts = []}: MobilePostsProps) => {
    return (
        <div className={styles.MobilePosts}>
            {posts.map(({title, url}, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={index} className={styles.MobilePost} src={url} alt={title} />
            ))}
        </div>
    );
};

interface PostDetailsProps {
    author?: string;
    isDank?: boolean;
    timestamp?: Date;
    title?: string;
    url?: string;
}

const PostDetails = ({
    author = "me",
    isDank = true,
    timestamp = new Date(),
    title = "Post title",
    url = ""
}: PostDetailsProps) => (
    <div className={styles.PostDetails}>
        <div className={styles.PostDetailsImage} />

        <div className={styles.PostDetailsContent}>
            <a href={url} className={styles.PostDetailsTitle}>
                {title}
            </a>

            <div className={styles.PostDetailsMetadata}>
                <p className={styles.PostDetailsAuthor}>Posted by {author}</p>
                <p className={styles.PostDetailsTimestamp}>{timestamp.toLocaleDateString()}</p>
            </div>

            <div className={styles.PostDetailsPredictionContainer}>
                <h3 className={styles.PostDetailsPredictionHeading}>Prediction</h3>

                <p className={styles.PostDetailsPrediction}>{isDank ? "Dank" : "Not Dank"}</p>
            </div>
        </div>
    </div>
);

const getCreatedTimeAgo = (createdUtc: number) => {
    const now = Math.floor(new Date().getTime() / 1000);
    const diff = now - createdUtc;
    const minutes = Math.floor(diff / 60);

    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        // Floor to the nearest 5 minutes
        const floored10Minutes = Math.floor(minutes / 5) * 5;
        return `${floored10Minutes} minute${floored10Minutes !== 1 ? "s" : ""} ago`;
    }
};
