import React from "react";
import styles from "./CommentCard.module.css"; // Add styling as needed

const CommentCard = ({ comment }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentHeader}>
        <span className={styles.commentAuthor}>User {comment.user_id}</span> {/* Replace with username when available */}
        <span className={styles.commentDate}>{formatDate(comment.created_at)}</span>
      </div>
      <p className={styles.commentContent}>{comment.content}</p>
    </div>
  );
};

// Example usage with dummy data
const dummyComment = {
  id: 1,
  post_id: 1,
  user_id: 3,
  content: "This is a dummy comment. Great post!",
  created_at: "2025-03-06T12:00:00Z",
  updated_at: "2025-03-06T12:00:00Z",
};

export const ExampleCommentCard = () => <CommentCard comment={dummyComment} />;

export default CommentCard;
