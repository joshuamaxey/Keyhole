import React, { useEffect, useState } from "react";
import styles from "./CommentCard.module.css";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import DeleteCommentModal from "./DeleteCommentModal";
import UpdateCommentModal from "./UpdateCommentModal";

const CommentCard = ({ comment, currentUser, refreshComments }) => {
  const [user, setUser] = useState(null);
  const [likesCount, setLikesCount] = useState(0); // State to track comment likes
  const [liked, setLiked] = useState(false); // Track if the comment is liked
  const dispatch = useDispatch()
  const { setModalContent, openModal } = useModal();

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

  // Fetch the likes count for the comment
  useEffect(() => {
    const fetchCommentLikes = async () => {
      try {
        const response = await fetch(`/api/comments/${comment.id}/comment_likes`);
        if (response.ok) {
          const data = await response.json();
          setLikesCount(data.comment_likes); // Assuming backend returns a key `comment_likes` with the count
        }
      } catch (error) {
        console.error("Failed to fetch comment likes:", error);
      }
    };

    fetchCommentLikes();
  }, [comment.id]);

  // Handle the "Like" button click
  const handleLike = async () => {
    try {
      const response = await fetch(`/api/comments/${comment.id}/comment_likes`, {
        method: liked ? "DELETE" : "POST", // Toggle between like and unlike
      });

      if (response.ok) {
        const updatedLikes = await response.json();
        setLikesCount(updatedLikes.comment_likes); // Update the likes count
        setLiked(!liked); // Toggle the liked state
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleDelete = () => {
    setModalContent(<DeleteCommentModal commentId={comment.id} refreshComments={refreshComments} />); // Set the modal content
    openModal(); // Open the modal
  };

  const handleEdit = () => {
    setModalContent(<UpdateCommentModal comment={comment} refreshComments={refreshComments} />); // Set the modal content
    openModal(); // Open the modal
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
        <span>{likesCount} Likes</span>
        {currentUser && currentUser.id === comment.user_id && (
                  <>
                    <button
                      className={styles.updateButton}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the PostCard onClick
                        handleEdit(); // Open the UpdatePostModal
                      }}
                    >
                      UPDATE
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the PostCard onClick
                        handleDelete(e); // Trigger delete functionality
                      }}
                    >
                      DELETE
                    </button>
                  </>
        )}
        {currentUser && (
        <button
          onClick={handleLike}
          className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
        >
          {liked ? "UNLIKE" : "LIKE"}
        </button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
