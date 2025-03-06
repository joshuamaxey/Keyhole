import Navigation from "../Navigation/Navigation";
import React, { useState } from "react";
import styles from "./Feed.module.css";
import CreatePostCard from "./PostFeed/CreatePostCard";
import PostFeed from "./PostFeed/PostFeed";
import PostDetail from "./PostDetail/PostDetail";

const Feed = () => {
  const [selectedPost, setSelectedPost] = useState(null); // Track the selected post

  const handlePostClick = (post) => {
    setSelectedPost(post); // Set the clicked post to show PostDetail
  };

  const handleBackToFeed = () => {
    setSelectedPost(null); // Reset to show the main feed
  };

  return (
    <div className={styles.feedContainer}>
      <Navigation />
      {selectedPost ? ( // Conditional rendering
        <PostDetail post={selectedPost} onBack={handleBackToFeed} />
      ) : (
        <>
          <CreatePostCard />
          <PostFeed onPostClick={handlePostClick} /> {/* Pass click handler to PostFeed */}
        </>
      )}
    </div>
  );
};

export default Feed;
