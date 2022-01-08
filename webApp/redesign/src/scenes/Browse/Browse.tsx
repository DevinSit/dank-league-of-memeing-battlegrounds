import {MobileSpacer} from "components/";
import styles from "./Browse.module.scss";

const Browse = () => (
    <div className={styles.Browse}>
        <h1 className={styles.BrowseHeader}>Latest from r/dankmemes</h1>

        <main className={styles.BrowseContent}>
            <div className={styles.BrowsePosts}>
                <Post />
                <Post />
                <Post />
            </div>

            <MobilePosts />

            <PostDetails />
        </main>

        <MobileSpacer />
    </div>
);

export default Browse;

/* Other Components */

interface PostProps {
    author?: string;
    timestamp?: Date;
    title?: string;
}

const Post = ({author = "me", timestamp = new Date(), title = "Post title"}: PostProps) => (
    <div className={styles.Post}>
        <div className={styles.PostImage} />

        <div className={styles.PostContent}>
            <h2 className={styles.PostTitle}>{title}</h2>
            <p className={styles.PostAuthor}>Posted by {author}</p>
            <p className={styles.PostTimestamp}>{timestamp.toLocaleDateString()}</p>
        </div>
    </div>
);

const MobilePosts = () => {
    const count = 8;

    return (
        <div className={styles.MobilePosts}>
            {new Array(count).fill(0).map((_, index) => (
                <div key={index} className={styles.MobilePost} />
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
