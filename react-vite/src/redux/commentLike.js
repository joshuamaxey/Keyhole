import Cookies from 'js-cookie';

export const LIKE_COMMENT = "comments/LIKE_COMMENT";
export const UPDATE_COMMENT_LIKE_STATUS = "comments/UPDATE_COMMENT_LIKE_STATUS";
export const UNLIKE_COMMENT = "comments/UNLIKE_COMMENT";
export const FETCH_COMMENT_LIKES = "comments/FETCH_COMMENT_LIKES";

export const likeComment = (commentId, commentLikes) => {
  return {
    type: LIKE_COMMENT,
    payload: { commentId, commentLikes },
  };
};

export const updateCommentLikeStatus = (commentId, isLiked) => {
    return {
      type: UPDATE_COMMENT_LIKE_STATUS,
      payload: {
        commentId,
        isLiked,
      },
    };
};

export const unlikeComment = (commentId, commentLikes) => {
    return {
      type: UNLIKE_COMMENT,
      payload: { commentId, commentLikes },
    };
};

export const fetchCommentLikes = (commentId, commentLikes) => {
    return {
      type: FETCH_COMMENT_LIKES,
      payload: { commentId, commentLikes },
    };
  };

export const likeCommentThunk = (commentId) => async (dispatch) => {
  try {
    const csrfToken = Cookies.get("XSRF-TOKEN");

    const response = await fetch(`/api/comments/${commentId}/like`, { // Fixed backticks
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken, // Include CSRF token
      },
    });

    if (response.ok) {
      const data = await response.json(); // Parse the JSON response
      dispatch(likeComment(commentId, data.comment_likes)); // Corrected action dispatch
    } else {
      const error = await response.json();
      console.error("Failed to like comment:", error.message);
    }
  } catch (err) {
    console.error("Error liking comment:", err); // Fixed logging typo
  }
};

export const fetchCommentLikeStatusThunk = (commentId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like-status`);

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        dispatch(updateCommentLikeStatus(commentId, data.liked)); // Dispatch the action
      } else {
        console.error("Failed to fetch comment like status");
      }
    } catch (error) {
      console.error("Error fetching comment like status:", error);
    }
  };


  export const unlikeCommentThunk = (commentId) => async (dispatch) => {
    try {
      const csrfToken = Cookies.get("XSRF-TOKEN"); // Retrieve the CSRF token

      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        dispatch(unlikeComment(commentId, data.comment_likes)); // Dispatch the UNLIKE action
      } else {
        const error = await response.json();
        console.error("Failed to unlike comment:", error.message);
      }
    } catch (err) {
      console.error("Error unliking comment:", err);
    }
};

export const fetchCommentLikesThunk = (commentId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/comment_likes`);

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        dispatch(fetchCommentLikes(commentId, data.comment_likes)); // Dispatch the action
      } else {
        console.error("Failed to fetch comment likes");
      }
    } catch (error) {
      console.error("Error fetching comment likes:", error);
    }
  };

  const initialCommentLikeState = {
    commentsLikes: {}, // Tracks likes for comments
  };

  const commentLikeReducer = (state = initialCommentLikeState, action) => {
    switch (action.type) {
      case LIKE_COMMENT: {
        const { commentId, commentLikes } = action.payload;
        return {
          ...state,
          commentsLikes: {
            ...state.commentsLikes,
            [commentId]: {
              ...state.commentsLikes[commentId],
              likesCount: commentLikes,
              isLiked: true,
            },
          },
        };
      }
      case UNLIKE_COMMENT: {
        const { commentId, commentLikes } = action.payload;
        return {
          ...state,
          commentsLikes: {
            ...state.commentsLikes,
            [commentId]: {
              ...state.commentsLikes[commentId],
              likesCount: commentLikes,
              isLiked: false,
            },
          },
        };
      }
      case UPDATE_COMMENT_LIKE_STATUS: {
        const { commentId, isLiked } = action.payload;
        return {
          ...state,
          commentsLikes: {
            ...state.commentsLikes,
            [commentId]: {
              ...state.commentsLikes[commentId],
              isLiked: isLiked,
            },
          },
        };
      }
      case FETCH_COMMENT_LIKES: {
        const { commentId, commentLikes } = action.payload;
        return {
          ...state,
          commentsLikes: {
            ...state.commentsLikes,
            [commentId]: {
              ...state.commentsLikes[commentId],
              likesCount: commentLikes, // Update likes count
            },
          },
        };
      }
      default:
        return state;
    }
  };

export default commentLikeReducer;
