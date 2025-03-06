import React, { useEffect, useState } from "react";
import styles from "./PostCard.module.css";

const PostCard = ({ post, onClick }) => {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);

  // Fetch user and community data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${post.user_id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
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
          setCommunity(communityData);
        }
      } catch (error) {
        console.error("Failed to fetch community:", error);
      }
    };

    fetchUser();
    fetchCommunity();
  }, [post.user_id, post.community_id]);

  return (
    <div className={styles.postCardContainer} onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Community Name */}
      <div className={styles.communityName}>
        {community ? community.name : "Loading community..."}
      </div>

      {/* Content Row: Avatar and Main Content */}
      <div className={styles.contentRow}>
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
