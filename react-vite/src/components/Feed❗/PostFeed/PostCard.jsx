import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./PostCard.module.css";
import { useModal } from "../../../context/Modal";
import UpdatePostModal from "../UpdatePostModal";
import DeletePostModal from "../DeletePostModal";
import CreateCommentModal from "../CreateCommentModal";

const PostCard = ({ post, onClick, currentUser, refreshComments }) => {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Fixed useState declaration
  const { setModalContent, openModal } = useModal();

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

  // Fetch comments and likes when the post ID or refreshTrigger changes
  useEffect(() => {
    const fetchCommentsAndLikes = async () => {
      try {
        // Fetch comments count
        const commentsResponse = await fetch(`/api/posts/${post.id}/comments`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setCommentsCount(commentsData.comments.length); // Assuming comments are returned as an array
        }

        // Fetch likes count
        const likesResponse = await fetch(`/api/posts/${post.id}/post_likes`);
        if (likesResponse.ok) {
          const likesData = await likesResponse.json();
          setLikesCount(likesData.post_likes); // Use "post_likes" key from the backend response
        }
      } catch (error) {
        console.error("Error fetching comments or likes:", error);
      }
    };

    fetchCommentsAndLikes();
  }, [post.id, refreshTrigger]); // Added refreshTrigger here

  const handleEditClick = () => {
    setModalContent(<UpdatePostModal post={post} />);
    openModal();
  };

  const handleDelete = () => {
    setModalContent(<DeletePostModal postId={post.id} />);
    openModal();
  };

  const handleCommentClick = () => {
    setModalContent(
      <CreateCommentModal
        postId={post.id}
        refreshComments={
          refreshComments || (() => setRefreshTrigger((prev) => !prev)) // Use refreshTrigger toggle if refreshComments isn't passed
        }
      />
    );
    openModal();
  };

  return (
    <div className={styles.postCardContainer} onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Community Name */}
      <div className={styles.communityName}>
        {post.community_id === null ? "Keyhole" : community ? community.name : "Loading community..."}
      </div>

      {/* Content Row: Avatar and Main Content */}
      <div className={styles.contentRow}>
        <div className={styles.content}>
          <p className={styles.CONTENT}>{post.content}</p>
        </div>
      </div>

      {/* Author Name */}
      <div className={styles.authorName}>
        {user ? user.username : "Loading user..."}
      </div>

      {/* Action Buttons */}
      <div className={styles.postFooter}>
        {currentUser && (
        <button
          className={styles.likeButton}
          onClick={(e) => e.stopPropagation()}
        >
          LIKE
        </button>
        )}
        <div className={styles.postStats}>
          <span>{likesCount} Likes</span>
          <span>{commentsCount} Comments</span>
        </div>
        {currentUser && (
        <button
          className={styles.commentButton}
          onClick={(e) => {
            e.stopPropagation();
            handleCommentClick();
          }}
        >
          COMMENT
        </button>
        )}
        {currentUser && currentUser.id === post.user_id && (
          <>
            <button
              className={styles.updateButton}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick();
              }}
            >
              UPDATE
            </button>
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
            >
              DELETE
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
