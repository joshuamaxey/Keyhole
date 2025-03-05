import React, { useEffect, useState } from "react";
import styles from "./PostCard.module.css";

const PostCard = ({ post }) => {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);

  // Fetch user and community data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${post.user_id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Set user state
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const fetchCommunity = async () => {
      try {
        const response = await fetch(`/api/communities/${post.community_id}`);
        if (response.ok) {
          const communityData = await response.json();
          setCommunity(communityData); // Set community state
        }
      } catch (error) {
        console.error("Failed to fetch community:", error);
      }
    };

    fetchUser();
    fetchCommunity();
  }, [post.user_id, post.community_id]);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className={styles.postCardContainer}>
      {/* Community Name */}
      <div className={styles.communityName}>
        {community ? community.name : "Loading community..."}
      </div>

      {/* Content Row: Avatar and Main Content */}
      <div className={styles.contentRow}>
        {/* <div className={styles.avatar}>
          {user ? getInitials(user.username) : "?"}
        </div> */}
        <div className={styles.content}>
          <p>{post.content}</p>
        </div>
      </div>

      {/* Author Name */}
      <div className={styles.authorName}>
        {user ? user.username : "Loading user..."}
      </div>

      {/* Action Buttons */}
      <div className={styles.postFooter}>
        <button className={styles.likeButton}>LIKE</button>
        <button className={styles.commentButton}>COMMENT</button>
      </div>
    </div>
  );
};

export default PostCard;
