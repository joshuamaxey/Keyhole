import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPostsThunk } from "../../../redux/post";
import { fetchCommunityMembershipsThunk } from "../../../redux/communityMemberships";
import styles from "./PostFeed.module.css";
import PostCard from "./PostCard";

const PostFeed = ({ onPostClick, currentUser }) => {
  const dispatch = useDispatch();

  // Select posts, status, and error from the Redux store
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  // Select the community memberships from the Redux store
  const communityMemberships = useSelector((state) => state.communityMemberships);
  const communityMembershipIds = communityMemberships.map((community) => community.id);

  // Fetch posts when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPostsThunk());
    }
  }, [status, dispatch]);

  // Fetch community memberships when a user logs in
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchCommunityMembershipsThunk(currentUser.id));
    }
  }, [dispatch, currentUser]);

  // Filter posts for logged-in users
  const filteredPosts = currentUser
    ? posts.filter(
        (post) =>
          post.community_id === null || communityMembershipIds.includes(post.community_id)
      )
    : posts; // Show all posts for logged-out users

  return (
    <div className={styles.postFeedContainer}>
      {/* Handle loading state */}
      {status === "loading" && <p>Loading posts...</p>}

      {/* Handle error state */}
      {status === "failed" && <p>Error: {error}</p>}

      {/* Render filtered posts if fetching succeeded */}
      {status === "succeeded" && filteredPosts.length > 0 &&
        filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => onPostClick(post)}
            currentUser={currentUser} // Pass the currentUser prop to PostCard
          />
        ))
      }

      {/* Fallback for empty filtered posts */}
      {status === "succeeded" && filteredPosts.length === 0 && (
        <>
          {currentUser && communityMemberships.length === 0 ? (
            <p className={styles.noPosts}>Join a community to see their posts in your feed!</p>
          ) : (
            <p>No posts available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PostFeed;
