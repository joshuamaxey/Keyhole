import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPostsThunk } from "../../../redux/post";
import styles from "./PostFeed.module.css";
import PostCard from "./PostCard";

const PostFeed = ({ onPostClick }) => { // Receive onPostClick as a prop
  const dispatch = useDispatch();

  // Select posts, status, and error from the Redux store
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  // Fetch posts when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPostsThunk());
    }
  }, [status, dispatch]);

  return (
    <div className={styles.postFeedContainer}>
      {/* Handle loading state */}
      {status === "loading" && <p>Loading posts...</p>}

      {/* Handle error state */}
      {status === "failed" && <p>Error: {error}</p>}

      {/* Render posts if fetching succeeded */}
      {status === "succeeded" &&
        posts.map((post) => (
          <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} /> // Pass onClick to PostCard
        ))}

      {/* Fallback for empty posts */}
      {status === "succeeded" && posts.length === 0 && (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostFeed;
