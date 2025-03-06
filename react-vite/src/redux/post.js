import Cookies from "js-cookie";

// Action Types
const SET_POSTS = "posts/SET_POSTS";
const ADD_POST = "post/ADD_POST";
const DELETE_POST = "post/DELETE_POST";


// Action Creators
export const setPosts = (posts, status = "idle", error = null) => ({
    type: SET_POSTS,
    posts,
    status,
    error,
  });

export const addPost = (post) => ({
    type: ADD_POST,
    post, // Pass the new post as the payload
  });

  export const deletePost = (postId) => ({
    type: DELETE_POST,
    postId, // Pass the ID of the post to be deleted
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

export const thunkCreatePost = (postData) => async (dispatch) => {
  try {
    // Retrieve the CSRF token
    const csrfToken = Cookies.get("XSRF-TOKEN");

    // Make the POST request
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken, // Include the CSRF token
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const newPost = await response.json();
      dispatch(addPost(newPost)); // Dispatch the action to add the new post
      return null; // No errors
    } else if (response.status < 500) {
      const errorData = await response.json();
      return errorData.errors; // Return validation errors
    } else {
      return { server: "An error occurred. Please try again." };
    }
  } catch (error) {
    console.error("Failed to create post:", error);
    return { server: "An error occurred. Please try again." };
  }
};

export const thunkDeletePost = (postId) => async (dispatch) => {
  try {
    // Retrieve the CSRF token
    const csrfToken = Cookies.get("XSRF-TOKEN");

    // Make the DELETE request
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-TOKEN": csrfToken, // Include the CSRF token
      },
    });

    if (response.ok) {
      dispatch(deletePost(postId)); // Dispatch the action to remove the post from the state
      return null; // Indicate success
    } else if (response.status === 403) {
      return { error: "You do not have permission to delete this post." };
    } else {
      const errorData = await response.json();
      return errorData.errors || { error: "An error occurred. Please try again." };
    }
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { server: "An error occurred. Please try again." };
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

      case ADD_POST: // Handle adding a new post
        return {
          ...state,
          posts: [action.post, ...state.posts], // Add the new post to the beginning of the posts array
        };

      case DELETE_POST: // Handle deleting a post
        return {
          ...state,
          posts: state.posts.filter((post) => post.id !== action.postId), // Remove the post by its ID
        };

      default:
        return state;
    }
  }
