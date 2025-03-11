// CommunityDetail.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleCommunityThunk } from "../../../redux/community";
import { fetchCommunityPostsThunk } from "../../../redux/post";
import CommunityCard from "../../Communities❗/CommunityCard";
import PostCard from "../PostFeed/PostCard"; // Import PostCard
import styles from "./CommunityDetail.module.css";

const CommunityDetail = ({ communityId, onBack }) => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]); // Local state to store posts
  const community = useSelector((state) => state.communities[communityId]); // Fetch community from Redux
  const currentUser = useSelector((state) => state.session.user); // Fetch the current user

  useEffect(() => {
    // Fetch community details when the component mounts
    dispatch(fetchSingleCommunityThunk(communityId));
    fetchPosts(); // Fetch posts for the community
  }, [dispatch, communityId]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts/community/${communityId}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts); // Update posts state
      } else {
        console.error("Failed to fetch posts for the community.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const refreshPosts = async () => {
    // Refresh the posts dynamically
    await fetchPosts();
  };

  if (!community) return <p>Loading community details...</p>; // Placeholder for loading

  return (
    <div className={styles.communityDetailContainer}>
      {/* Back Button */}
      <button onClick={onBack} className={styles.backButton}>
        Back to Feed
      </button>

      {/* CommunityCard for the community */}
      <div className={styles.communityCardWrapper}>
        <CommunityCard
          name={community.name}
          description={community.description}
          members={community.members.length}
        />
      </div>

      {/* Posts for the community */}
      <div className={styles.postsWrapper}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              refreshPosts={refreshPosts} // Pass the refresh function
            />
          ))
        ) : (
          <p>No posts in this community yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
