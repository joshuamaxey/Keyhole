import Navigation from "../Navigation/Navigation";
import React from "react";
import styles from "./Feed.module.css";
import CreatePostCard from "./CreatePostCard";
import PostFeed from "./PostFeed";

const Feed = () => {
    return (
        <div className={styles.feedContainer}>
            <Navigation />
            <CreatePostCard />
            <PostFeed />
            {/* <PostCard /> */}
        </div>
    );
};

export default Feed;
