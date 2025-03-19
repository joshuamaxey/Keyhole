import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PostCard.module.css";
import { useModal } from "../../../context/Modal";
import UpdatePostModal from "../UpdatePostModal";
import DeletePostModal from "../DeletePostModal";
import CreateCommentModal from "../CreateCommentModal";
import { likePostThunk } from "../../../redux/like";
import { fetchLikeStatusThunk } from "../../../redux/like";
import { unlikePostThunk } from "../../../redux/like";
import { fetchPostLikesThunk } from "../../../redux/like";

const PostCard = ({ post, onClick, currentUser, refreshComments, onBack }) => {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const isLiked = useSelector((state) => {
    return state.likes.postsLikes[post.id]?.isLiked || false;
  });

  const likesCount = useSelector((state) =>
    state.likes.postsLikes[post.id]?.likesCount || 0
  );

  const [refreshTrigger, setRefreshTrigger] = useState(false); // Fixed useState declaration
  const { setModalContent, openModal } = useModal();
  const dispatch = useDispatch();

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
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentsAndLikes();
  }, [post.id, refreshTrigger]); // Only dependent on post and refreshTrigger

  useEffect(() => {
    if (currentUser) { // Only fetch like status if the user is logged in
      console.log("Dispatching fetchLikeStatusThunk for post:", post.id);
      dispatch(fetchLikeStatusThunk(post.id));
    }
  }, [dispatch, post.id, currentUser]);

  useEffect(() => {
    dispatch(fetchPostLikesThunk(post.id)); // Fetch and update likes count for this post
  }, [dispatch, post.id]);


  const handleEditClick = () => {
    setModalContent(<UpdatePostModal post={post} />);
    openModal();
  };

  const handleDelete = () => {
    setModalContent(<DeletePostModal postId={post.id} onBack={onBack} />);
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

  const handleLike = async () => {
    try {
      if (isLiked) {
        await dispatch(unlikePostThunk(post.id)); // Unlike the post
      } else {
        await dispatch(likePostThunk(post.id)); // Like the post
      }
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
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
        onClick={(e) => {
          e.stopPropagation();
          handleLike(); // Call handleLike when the button is clicked
        }}
      >
        {isLiked ? "UNLIKE" : "LIKE"}
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
              ...
            </button>
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
            >
              X
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
