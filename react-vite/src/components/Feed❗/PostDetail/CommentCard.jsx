import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./CommentCard.module.css";
import { useModal } from "../../../context/Modal";
import DeleteCommentModal from "./DeleteCommentModal";
import UpdateCommentModal from "./UpdateCommentModal";
import { likeCommentThunk } from "../../../redux/commentLike";
import { fetchCommentLikeStatusThunk } from "../../../redux/commentLike";
import { unlikeCommentThunk } from "../../../redux/commentLike";
import { fetchCommentLikesThunk } from "../../../redux/commentLike";

const CommentCard = ({ comment, currentUser, refreshComments }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { setModalContent, openModal } = useModal();

  // Retrieve like data from Redux
  const likesCount = useSelector((state) =>
    state.commentLikes.commentsLikes[comment.id]?.likesCount || 0
  );
  const isLiked = useSelector((state) =>
    state.commentLikes.commentsLikes[comment.id]?.isLiked || false
  );

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${comment.user_id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [comment.user_id]);

  useEffect(() => {
    dispatch(fetchCommentLikeStatusThunk(comment.id));
  }, [dispatch, comment.id]);

  useEffect(() => {
    dispatch(fetchCommentLikesThunk(comment.id)); // Fetch the likes count
  }, [dispatch, comment.id]);

  const handleDelete = () => {
    setModalContent(
      <DeleteCommentModal
        commentId={comment.id}
        refreshComments={refreshComments}
      />
    ); // Set the modal content
    openModal(); // Open the modal
  };

  const handleEdit = () => {
    setModalContent(
      <UpdateCommentModal comment={comment} refreshComments={refreshComments} />
    ); // Set the modal content
    openModal(); // Open the modal
  };

  const handleLike = () => {
    if (isLiked) {
      dispatch(unlikeCommentThunk(comment.id)); // Unlike the comment
    } else {
      dispatch(likeCommentThunk(comment.id)); // Like the comment
    }
  };

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentHeader}>
        <span className={styles.commentAuthor}>
          {user ? user.username : "Loading username..."}
        </span>
        <span className={styles.commentDate}>
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>
      <p className={styles.commentContent}>{comment.content}</p>
      <div className={styles.commentFooter}>
        {/* Left-aligned Likes Section */}
        <div className={styles.likesSection}>
          <button
            onClick={handleLike}
            className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
          >
            {isLiked ? "UNLIKE" : "LIKE"}
          </button>
          <span className={styles.likesCount}>{likesCount} Likes</span>
        </div>

        {/* Right-aligned Buttons */}
        <div className={styles.actionButtons}>
          {currentUser && currentUser.id === comment.user_id && (
            <>
              <button
                className={styles.updateButton}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the PostCard onClick
                  handleEdit(); // Open the UpdateCommentModal
                }}
              >
                ...
              </button>
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the PostCard onClick
                  handleDelete(e); // Trigger delete functionality
                }}
              >
                X
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
