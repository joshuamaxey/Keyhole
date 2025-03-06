// Container for PostCard with CommentCards
import React, { useEffect, useState } from "react";
import PostCard from "../PostFeed/PostCard"; // Import your existing PostCard component
import CommentCard from "./CommentCard"; // Import the CommentCard
import styles from "./PostDetail.module.css";

const PostDetail = ({ post, onBack }) => {
  const [comments, setComments] = useState([]); // State to store comments

  useEffect(() => {
    // Fetch comments for the selected post
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${post.id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments); // Assuming API returns an array of comments
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post.id]);

  return (
    <div className={styles.postDetailContainer}>
      <button onClick={onBack} className={styles.backButton}>Back to Feed</button>
      <div className={styles.postCardWrapper}>
        <PostCard post={post} /> {/* Render the selected PostCard */}
      </div>
      <div className={styles.commentsWrapper}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} /> // Render one CommentCard per comment
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
