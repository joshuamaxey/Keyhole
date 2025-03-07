import Cookies from "js-cookie";

const DELETE_COMMENT = "comment/DELETE_COMMENT";
const UPDATE_COMMENT = "comment/UPDATE_COMMENT";
const CREATE_COMMENT = "comment/CREATE_COMMENT";


export const deleteComment = (commentId) => ({
    type: DELETE_COMMENT,
    commentId, // Pass the ID of the comment to be deleted
  });

  export const updateComment = (comment) => ({
    type: UPDATE_COMMENT,
    comment, // Pass the updated comment as the payload
  });

  export const createComment = (comment) => ({
    type: CREATE_COMMENT,
    comment, // Pass the newly created comment as the payload
  });


export const thunkDeleteComment = (commentId) => async (dispatch) => {
    try {
      // Retrieve the CSRF token
      const csrfToken = Cookies.get("XSRF-TOKEN");

      // Make the DELETE request
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": csrfToken, // Include the CSRF token for authentication
        },
      });

      if (response.ok) {
        dispatch(deleteComment(commentId)); // Dispatch the action to update the Redux state
        return null; // Indicate success
      } else if (response.status === 403) {
        return { error: "You do not have permission to delete this comment." };
      } else {
        const errorData = await response.json();
        return errorData.errors || { error: "An error occurred. Please try again." };
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      return { server: "An error occurred. Please try again." };
    }
};

export const thunkUpdateComment = (commentId, content) => async (dispatch) => {
  try {
    // Retrieve the CSRF token
    const csrfToken = Cookies.get("XSRF-TOKEN");

    // Make the PUT request
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken, // Include the CSRF token for authentication
      },
      body: JSON.stringify({ content }), // Send the updated comment content
    });

    if (response.ok) {
      const updatedComment = await response.json();
      dispatch(updateComment(updatedComment)); // Dispatch the action to update Redux state
      return null; // Indicate success
    } else if (response.status === 403) {
      return { error: "You do not have permission to update this comment." };
    } else {
      const errorData = await response.json();
      return errorData.errors || { error: "An error occurred. Please try again." };
    }
  } catch (error) {
    console.error("Failed to update comment:", error);
    return { server: "An error occurred. Please try again." };
  }
};

export const thunkCreateComment = (postId, content) => async (dispatch) => {
  try {
    // Retrieve the CSRF token
    const csrfToken = Cookies.get("XSRF-TOKEN");

    // Make the POST request
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken, // Include the CSRF token for authentication
      },
      body: JSON.stringify({ content }), // Send the content as the body
    });

    if (response.ok) {
      const newComment = await response.json();
      dispatch(createComment(newComment)); // Dispatch the action with the new comment
      return null; // Indicate success
    } else if (response.status < 500) {
      const errorData = await response.json();
      return errorData.errors || { error: "Validation failed." }; // Return errors if validation fails
    } else {
      return { error: "An error occurred. Please try again later." }; // Generic error message
    }
  } catch (error) {
    console.error("Failed to create comment:", error);
    return { error: "An error occurred. Please try again later." }; // Handle network or server errors
  }
};


  const initialState = {
    comments: [],
  };

  export default function commentReducer(state = initialState, action) {
    switch (action.type) {
      case DELETE_COMMENT: // Handle deleting a comment
        return {
          ...state,
          comments: state.comments.filter((comment) => comment.id !== action.commentId),
        };

      case UPDATE_COMMENT: // Handle updating a comment
        return {
          ...state,
          comments: state.comments.map((comment) =>
            comment.id === action.comment.id ? action.comment : comment // Replace the old comment with the updated one
          ),
        };

        case CREATE_COMMENT:
        return {
          ...state,
          comments: [...state.comments, action.comment].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        };

      default:
        return state;
    }
  }
