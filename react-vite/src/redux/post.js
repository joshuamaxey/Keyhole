// post.js

// Action Types
const SET_POSTS = "posts/SET_POSTS";


// Action Creators
export const setPosts = (posts, status = "idle", error = null) => ({
    type: SET_POSTS,
    posts,
    status,
    error,
  });


// Thunk Action for Fetching Posts
export const fetchPostsThunk = () => async (dispatch) => {
    dispatch(setPosts([], "loading")); // Set status to "loading" before the fetch

    try {
      const response = await fetch("/api/posts");

      if (response.ok) {
        const data = await response.json();
        dispatch(setPosts(data.posts, "succeeded")); // Set posts and status to "succeeded"
      } else {
        const error = await response.json();
        dispatch(setPosts([], "failed", error.message)); // Set status to "failed" with error
      }
    } catch (err) {
      dispatch(setPosts([], "failed", err.message)); // Catch network or other errors
    }
  };



  // Initial State
  const initialState = {
    posts: [],
    status: "idle", // "idle", "loading", "succeeded", "failed"
    error: null,     // Error message (if any)
  };

  export default function postReducer(state = initialState, action) {
    switch (action.type) {
      case SET_POSTS:
        return {
          ...state,
          posts: action.posts,
          status: action.status,
          error: action.error,
        };
      default:
        return state;
    }
  }

