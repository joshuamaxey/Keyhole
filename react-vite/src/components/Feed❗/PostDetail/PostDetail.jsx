// Container for PostCard with CommentCards
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostCard from "../PostFeed/PostCard"; // Import your existing PostCard component
import CommentCard from "./CommentCard"; // Import the CommentCard
import styles from "./PostDetail.module.css";

const PostDetail = ({ post, onBack }) => {
  const [comments, setComments] = useState([]); // State to store comments
  const currentUser = useSelector((state) => state.session.user); // Fetch the current user from the Redux store

  useEffect(() => {
    // Fetch comments for the selected post
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${post.id}/comments`);
        if (response.ok) {
          const data = await response.json();
          // Sort comments by created_at in descending order (newest first)
          const sortedComments = data.comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setComments(sortedComments); // Update the comments state with sorted comments
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post.id]);

  const refreshComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments); // Update the comments state
      } else {
        console.error("Failed to refresh comments");
      }
    } catch (error) {
      console.error("Error refreshing comments:", error);
    }
  };

  return (
    <div className={styles.postDetailContainer}>
      <button onClick={onBack} className={styles.backButton}>Back</button>
      <div className={styles.postCardWrapper}>
        <PostCard post={post} currentUser={currentUser} refreshComments={refreshComments} onBack={onBack} /> {/* Render the selected PostCard */}
      </div>
      <div className={styles.commentsWrapper}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} currentUser={currentUser} refreshComments={refreshComments} /> // Render one CommentCard per comment
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
