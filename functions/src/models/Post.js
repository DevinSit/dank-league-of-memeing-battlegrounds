const Datastore = require("@google-cloud/datastore");
const config = require("../config");

const KIND = "RedditPost";

const datastore = new Datastore({projectId: config.PROJECT_ID});

class Post {
    constructor({
        id = "",
        url = "",
        createdUtc = 0,
        author = "",
        subreddit = "",
        title = "",
        permalink = "",
        imageHash = ""
    }) {
        this.id = id;
        this.url = url;
        this.createdUtc = createdUtc;
        this.author = author;
        this.subreddit = subreddit;
        this.title = title;
        this.permalink = permalink;
        this.imageHash = imageHash;
        this.notFound = false;
    }

    static async updateHash(postId, imageHash) {
        const post = await Post.fetchPost(postId);

        if (post) {
            post.imageHash = imageHash;
            post.save();
        }

        return post;
    }

    static async setNotFound(postId) {
        const post = await Post.fetchPost(postId);

        if (post) {
            post.notFound = true;
            post.save();
        }

        return post;
    }

    static async deletePost(postId) {
        const key = datastore.key([KIND, postId]);

        try {
            await datastore.delete(key);
        } catch (e) {
            console.error(e);
        }
    }

    static async isPostMissingImageHash(postId) {
        const post = await Post.fetchPost(postId);
        return post && !post.imageHash;
    }

    static async fetchPost(postId) {
        const key = datastore.key([KIND, postId]);

        try {
            const entities = await datastore.get(key);

            if (!entities || !entities.length) {
                return null;
            }

            return new Post(entities[0]);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    // Note: "available" = "notFound === false".
    // That is, all the posts we have yet to find with a 404 image.
    static async fetchAllAvailable() {
        const query = datastore.createQuery(KIND).filter("notFound", "=", false);
        const [posts] = await datastore.runQuery(query);

        return posts;
    }

    entity() {
        const key = datastore.key([KIND, this.id]);

        return {
            key,
            data: {
                id: this.id,
                url: this.url,
                createdUtc: this.createdUtc,
                author: this.author,
                subreddit: this.subreddit,
                title: this.title,
                permalink: this.permalink,
                imageHash: this.imageHash,
                notFound: this.notFound
            },
            excludeFromIndexes: ["url", "author", "title", "permalink"]
        };
    }

    save() {
        datastore.upsert(this.entity());
    }
}

module.exports = Post;
