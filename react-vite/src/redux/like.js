import Cookies from "js-cookie";

// Action Types
export const LIKE_POST = "posts/LIKE_POST";
export const UPDATE_LIKE_STATUS = "posts/UPDATE_LIKE_STATUS";
export const UNLIKE_POST = "posts/UNLIKE_POST";
export const FETCH_POST_LIKES = "posts/FETCH_POST_LIKES";


// Action Creators
export const likePost = (postId, postLikes) => {
  return {
    type: LIKE_POST,
    payload: { postId, postLikes },
  };
};

export const updateLikeStatus = (postId, isLiked) => {
    return {
      type: UPDATE_LIKE_STATUS,
      payload: {
        postId,
        isLiked,
      },
    };
  };

  export const unlikePost = (postId, postLikes) => {
    return {
      type: UNLIKE_POST,
      payload: { postId, postLikes },
    };
  };

  export const fetchPostLikes = (postId, postLikes) => {
    return {
      type: FETCH_POST_LIKES,
      payload: { postId, postLikes },
    };
  };


// Thunks
export const likePostThunk = (postId) => async (dispatch, getState) => {
    try {
      const csrfToken = Cookies.get("XSRF-TOKEN");

      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(likePost(postId, data.post_likes)); // Update the likes count

        // Optimistically update the "isLiked" status in Redux
        const currentPostsLikes = getState().likes.postsLikes;
        dispatch(updateLikeStatus(postId, true)); // Mark the post as liked
      } else {
        const error = await response.json();
        console.error("Failed to like post:", error.message);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };


export const fetchLikeStatusThunk = (postId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like-status`);
      if (response.ok) {
        const data = await response.json();
        dispatch(updateLikeStatus(postId, data.liked)); // Dispatch the action
      } else {
        console.error("Failed to fetch like status");
      }
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  export const unlikePostThunk = (postId) => async (dispatch, getState) => {
    try {
      const csrfToken = Cookies.get("XSRF-TOKEN");

      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken, // Include the CSRF token
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(unlikePost(postId, data.post_likes)); // Update the likes count

        // Optimistically update the "isLiked" status in Redux
        const currentPostsLikes = getState().likes.postsLikes;
        dispatch(updateLikeStatus(postId, false)); // Mark the post as unliked
      } else {
        const error = await response.json();
        console.error("Failed to unlike post:", error.message);
      }
    } catch (err) {
      console.error("Error unliking post:", err);
    }
  };

  export const fetchPostLikesThunk = (postId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/posts/${postId}/post_likes`);
      if (response.ok) {
        const data = await response.json();
        dispatch(fetchPostLikes(postId, data.post_likes)); // Dispatch the action to update the Redux state
      } else {
        console.error("Failed to fetch post likes");
      }
    } catch (error) {
      console.error("Error fetching post likes:", error);
    }
  };



// Reducer
const initialState = {
  postsLikes: {}, // Object to store likes count for each post, e.g., { postId: likesCount }
};

const likeReducer = (state = initialState, action) => {
    switch (action.type) {
      case LIKE_POST: {
        const { postId, postLikes } = action.payload;
        return {
          ...state,
          postsLikes: {
            ...state.postsLikes,
            [postId]: {
              ...state.postsLikes[postId],
              likesCount: postLikes,
              isLiked: true, // Mark the post as liked
            },
          },
        };
      }
      case UNLIKE_POST: {
        const { postId, postLikes } = action.payload;
        return {
          ...state,
          postsLikes: {
            ...state.postsLikes,
            [postId]: {
              ...state.postsLikes[postId],
              likesCount: postLikes,
              isLiked: false, // Mark the post as unliked
            },
          },
        };
      }
      case UPDATE_LIKE_STATUS: {
        const { postId, isLiked } = action.payload;
        const postLikes = state.postsLikes[postId] || { likedBy: [], likesCount: 0 };

        return {
          ...state,
          postsLikes: {
            ...state.postsLikes,
            [postId]: {
              ...postLikes,
              isLiked: isLiked, // Update the isLiked status
            },
          },
        };
      }
      case FETCH_POST_LIKES: {
        const { postId, postLikes } = action.payload;
        return {
          ...state,
          postsLikes: {
            ...state.postsLikes,
            [postId]: {
              ...state.postsLikes[postId],
              likesCount: postLikes, // Update the likes count for the specific post
            },
          },
        };
      }
      default:
        return state;
    }
  };


export default likeReducer;
