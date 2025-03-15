import Navigation from "../Navigation/Navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Feed.module.css";
import CreatePostCard from "./PostFeed/CreatePostCard";
import PostFeed from "./PostFeed/PostFeed";
import PostDetail from "./PostDetail/PostDetail";
import CommunityDetail from "./CommunityDetail/CommunityDetail";

const Feed = ({
  selectedCommunity,
  setSelectedCommunity,
  selectedPost,
  setSelectedPost,
  onBackToFeed,
}) => {
  const currentUser = useSelector((state) => state.session.user);
  const communityMemberships = useSelector(
    (state) => state.communityMemberships
  );
  const communityMembershipIds = communityMemberships.map(
    (community) => community.id
  );

  const handlePostClick = (post) => {
    setSelectedPost(post); // Set the clicked post to show PostDetail
  };

  const handleBackToPostFeed = () => {
    setSelectedPost(null); // Reset selected post
  };

  return (
    <div className={styles.feedContainer}>
      <Navigation />

      {/* Prioritize PostDetail when selected */}
      {selectedPost ? (
        <PostDetail
          post={selectedPost}
          onBack={handleBackToPostFeed} // Go back to CommunityDetail or PostFeed
          currentUser={currentUser}
        />
      ) : selectedCommunity ? (
        <>
          {communityMembershipIds.includes(selectedCommunity) && (
            <CreatePostCard communityId={selectedCommunity} />
          )}

          <CommunityDetail
            communityId={selectedCommunity}
            onBack={onBackToFeed}
            onPostClick={handlePostClick} // Allow navigating to PostDetail
          />
        </>
      ) : (
        <>
          <CreatePostCard />
          <PostFeed onPostClick={handlePostClick} currentUser={currentUser} />
        </>
      )}
    </div>
  );
};

export default Feed;
