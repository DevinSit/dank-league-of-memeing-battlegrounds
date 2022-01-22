import classNames from "classnames";
import {useState} from "react";
import {animated, useSpring, useTransition} from "@react-spring/web";
import {MobileSpacer} from "components/";
import {ValueFormatting} from "services/";
import type {Post as PostType} from "types";
import styles from "./Browse.module.scss";

interface BrowseProps {
    posts: Array<PostType>;
}

const Browse = ({posts = []}: BrowseProps) => {
    const [selectedPostIndex, setSelectedPostIndex] = useState(0);

    const selectedPost = posts[selectedPostIndex] || {};

    const transition = useTransition(posts, {
        key: (post: PostType) => post.id,
        from: {opacity: 0, y: 1000, scale: 0.7},
        enter: {opacity: 1, y: 0, scale: 1}
    });

    const animatedPosts = transition((style, post, _, index) => (
        <animated.div style={style}>
            <Post
                {...post}
                isSelected={index === selectedPostIndex}
                onClick={() => setSelectedPostIndex(index)}
            />
        </animated.div>
    ));

    const detailsSpring = useSpring({from: {y: 1000, scale: 0.7}, to: {y: 0, scale: 1}});

    return (
        <div className={styles.Browse}>
            <h1 className={styles.BrowseHeader}>Latest from r/dankmemes</h1>

            <main className={styles.BrowseContent}>
                <div className={styles.BrowsePosts}>{animatedPosts}</div>

                <MobilePosts
                    posts={posts}
                    selectedPostIndex={selectedPostIndex}
                    onClickPost={setSelectedPostIndex}
                />

                <AnimatedPostDetails style={detailsSpring} {...selectedPost} />
            </main>

            <MobileSpacer />
        </div>
    );
};

export default Browse;

/* Other Components */

interface PostProps extends Pick<PostType, "author" | "createdUtc" | "title" | "url"> {
    isSelected: boolean;
    onClick: () => void;
}

const Post = ({
    isSelected = false,
    author,
    createdUtc,
    title,
    url,
    onClick,
    ...otherProps
}: PostProps) => (
    <div
        className={classNames(styles.Post, {[styles.PostSelected]: isSelected})}
        onClick={onClick}
        {...otherProps}
    >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.PostImage} src={url} alt={title} />

        <div className={styles.PostContent}>
            <h2 className={styles.PostTitle}>{title}</h2>
            <p className={styles.PostAuthor}>Posted by {author}</p>
            <p className={styles.PostTimestamp}>{ValueFormatting.formatTimeAgo(createdUtc)}</p>
        </div>
    </div>
);

interface MobilePostsProps {
    posts: Array<PostType>;
    selectedPostIndex: number;
    onClickPost: (index: number) => void;
}

const MobilePosts = ({posts = [], selectedPostIndex = 0, onClickPost}: MobilePostsProps) => {
    const transition = useTransition(posts, {
        key: (post: PostType) => post.id,
        from: {opacity: 0, x: 1000, scale: 0.7},
        enter: {opacity: 1, x: 0, scale: 1}
    });

    const animatedPosts = transition((style, {title, url}, _, index) => (
        <animated.div style={style}>
            {/* eslint-disable-next-line */}
            <img
                className={classNames(styles.MobilePost, {
                    [styles.MobilePostSelected]: selectedPostIndex === index
                })}
                src={url}
                alt={title}
                onClick={() => onClickPost(index)}
            />
        </animated.div>
    ));

    return <div className={styles.MobilePosts}>{animatedPosts}</div>;
};

interface PostDetailsProps
    extends Pick<
        PostType,
        "author" | "createdUtc" | "kerasPrediction" | "permalink" | "title" | "url"
    > {}

const PostDetails = ({
    author,
    createdUtc,
    kerasPrediction,
    permalink,
    title,
    url,
    ...otherProps
}: PostDetailsProps) => (
    <div className={styles.PostDetails} {...otherProps}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.PostDetailsImage} src={url} alt={title} />

        <div className={styles.PostDetailsContent}>
            <a
                href={ValueFormatting.formatRedditLink(permalink)}
                className={styles.PostDetailsTitle}
            >
                {title}
            </a>

            <div className={styles.PostDetailsMetadata}>
                <p className={styles.PostDetailsAuthor}>Posted by {author}</p>
                <p className={styles.PostDetailsTimestamp}>
                    {ValueFormatting.formatTimeAgo(createdUtc)}
                </p>
            </div>

            <div className={styles.PostDetailsPredictionContainer}>
                <h3 className={styles.PostDetailsPredictionHeading}>Prediction</h3>

                <p className={styles.PostDetailsPrediction}>
                    {ValueFormatting.formatPrediction(kerasPrediction)}
                </p>
            </div>
        </div>
    </div>
);

const AnimatedPostDetails = animated(PostDetails);
