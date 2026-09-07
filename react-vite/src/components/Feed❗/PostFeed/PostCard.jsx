import { FiHeart, FiMessageCircle, FiArrowUpRight, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./PostCard.module.css";
import { useModal } from "../../../context/Modal";
import UpdatePostModal from "../UpdatePostModal";
import DeletePostModal from "../DeletePostModal";
import CreateCommentModal from "../CreateCommentModal";
import { likePostThunk } from "../../../redux/postLike";
import { fetchLikeStatusThunk } from "../../../redux/postLike";
import { unlikePostThunk } from "../../../redux/postLike";
import { fetchPostLikesThunk } from "../../../redux/postLike";

const PostCard = ({ post, onClick, currentUser, refreshComments, onBack }) => {
  const [user, setUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Fixed useState declaration
  const { setModalContent } = useModal();
  const dispatch = useDispatch();

  const isLiked = useSelector((state) => {
    return state.likes.postsLikes[post.id]?.isLiked || false;
  });

  const likesCount = useSelector(
    (state) => state.likes.postsLikes[post.id]?.likesCount || 0
  );

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
    if (post.community_id != null) fetchCommunity();
    else setCommunity(null);
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
    if (currentUser) {
      // Only fetch like status if the user is logged in

      dispatch(fetchLikeStatusThunk(post.id));
    }
  }, [dispatch, post.id, currentUser]);

  useEffect(() => {
    dispatch(fetchPostLikesThunk(post.id)); // Fetch and update likes count for this post
  }, [dispatch, post.id]);

  const handleEditClick = () => {
    setModalContent(<UpdatePostModal post={post} />);
  };

  const handleDelete = () => {
    setModalContent(<DeletePostModal postId={post.id} onBack={onBack} />);
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
    <div
      className={styles.postCardContainer}
      onClick={onClick}

    >
      <div className={styles.postHeader}>
        <span className={styles.avatar}>{user?.username?.split("_").map(word => word[0]).slice(0, 2).join("") || "·"}</span>
        <div className={styles.byline}><span className={styles.authorName}>{user ? user.username.replaceAll("_", " ") : "Loading author…"}</span><span className={styles.communityName}>{post.community_id == null ? "Around Keyhole" : community?.name || "Community"}</span></div>
        {post.created_at && <time className={styles.date} dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time>}
      </div>
      <p className={styles.CONTENT}>{post.content}</p>
      {onClick && <button className={styles.readButton} onClick={e => { e.stopPropagation(); onClick(); }}>Read conversation <FiArrowUpRight aria-hidden="true" /></button>}

      {/* Action Buttons */}
      <div className={styles.postFooter}>
        {currentUser && (
          <button
            aria-pressed={isLiked}
            className={styles.likeButton}
            onClick={(e) => {
              e.stopPropagation();
              handleLike(); // Call handleLike when the button is clicked
            }}
          >
            <FiHeart aria-hidden="true" /> {isLiked ? "Liked" : "Like"}
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
            <FiMessageCircle aria-hidden="true" /> Reply
          </button>
        )}
        {currentUser && currentUser.id === post.user_id && (
          <>
            <button
              aria-label="Edit post"
              className={styles.updateButton}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick();
              }}
            >
              <FiEdit2 aria-hidden="true" />
            </button>
            <button
              aria-label="Delete post"
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
            >
              <FiTrash2 aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
