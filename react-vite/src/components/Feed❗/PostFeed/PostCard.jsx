import React, { useEffect, useState } from "react";
import styles from "./PostCard.module.css";
import { useDispatch } from "react-redux";
import { thunkDeletePost } from "../../../redux/post";
import { useModal } from "../../../context/Modal";
import UpdatePostModal from "../UpdatePostModal";


const PostCard = ({ post, onClick, currentUser }) => {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0); // State for comments count
  const [likesCount, setLikesCount] = useState(0); // State for likes count
  const dispatch = useDispatch()
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

  // Fetch comments count and likes count when the post ID is available
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
  }, [post.id]);

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent triggering the `onClick` event for the PostCard
    await dispatch(thunkDeletePost(post.id)); // Dispatch the delete thunk
  };

  const handleEditClick = () => {
    setModalContent(<UpdatePostModal post={post} />); // Set the modal content
    openModal(); // Open the modal
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
        <div className={styles.postStats}>
          <span>{likesCount} Likes</span>
          <span>{commentsCount} Comments</span>
        </div>
        <button className={styles.commentButton}>COMMENT</button>

        {/* Conditionally render the Update and Delete buttons */}
        {currentUser && currentUser.id === post.user_id && (
          <>
            <button
              className={styles.updateButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the PostCard onClick
                handleEditClick() // Open the UpdatePostModal
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
      </div>
    </div>
  );

};

export default PostCard;
