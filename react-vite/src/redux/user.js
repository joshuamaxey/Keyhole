import Cookies from "js-cookie";

const FETCH_USER = "user/FETCH_USER";
const SET_FOLLOWING = "user/setFollowing"
const SET_FOLLOWERS = "user/setFollowers"
const FETCH_USERS = "user/FETCH_USERS";
const UPDATE_BIO = "user/UPDATE_BIO";


// Action Creator
export const fetchUser = (user) => ({
  type: FETCH_USER,
  user,
});

export const setFollowing = (following) => ({
  type: SET_FOLLOWING,
  following,
});

export const setFollowers = (followers) => ({
  type: SET_FOLLOWERS,
  followers,
});

export const fetchUsers = (users) => ({
  type: FETCH_USERS,
  users, // This will be an array of user objects
});

export const updateBio = (bio) => ({
  type: UPDATE_BIO,
  bio, // This will be the updated bio string
});

// Thunk Action
export const fetchUserThunk = () => async (dispatch) => {
    const response = await fetch("/api/auth/current_user", {
      method: "GET",
      credentials: "include", // This ensures cookies are sent with the request
    });

    if (response.ok) {
      const user = await response.json();
      dispatch(fetchUser(user));
    }
  };


  // Fetch the list of users the given user is following
export const fetchFollowing = (userId) => async (dispatch) => {
  const response = await fetch(`/api/users/${userId}/following`);

  if (response.ok) {
    const data = await response.json();
    dispatch(setFollowing(data.following)); // Action to update the state
  } else {
    console.error("Failed to fetch following");
  }
};


// Fetch the list of users following the given user
export const fetchFollowers = (userId) => async (dispatch) => {
  const response = await fetch(`/api/users/${userId}/followers`);

  if (response.ok) {
    const data = await response.json();
    dispatch(setFollowers(data.followers)); // Action to update the state
  } else {
    console.error("Failed to fetch followers");
  }
};

export const fetchUsersThunk = (posts) => async (dispatch) => {
  const userIds = [...new Set(posts.map((post) => post.user_id))]; // Get unique user IDs

  try {
    const users = await Promise.all(
      userIds.map(async (userId) => {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const user = await response.json();
          return user;
        }
        return null; // Skip failed requests
      })
    );

    const validUsers = users.filter((user) => user !== null); // Remove null results
    dispatch(fetchUsers(validUsers)); // Dispatch action with the users
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};



export const thunkUpdateBio = (bio) => async (dispatch) => {
  try {
    const csrfToken = Cookies.get("XSRF-TOKEN");

    const response = await fetch(`/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken, // Include the CSRF token here
      },
      body: JSON.stringify({ bio }),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      dispatch(updateBio(updatedUser.bio)); // Dispatch the updated bio
    } else {
      const error = await response.json();
      return error.errors; // Return errors if the request fails
    }
  } catch (error) {
    console.error("Failed to update bio:", error);
    return { error: "Something went wrong. Please try again later." };
  }
};


// Initial State
const initialState = {
  usersById: {}, // Ensure it's initialized as an empty object
  following: [],
  followers: [],
  status: "idle",
  error: null,
};


// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, ...action.user };

    case SET_FOLLOWING:
      return { ...state, following: action.following };

    case SET_FOLLOWERS:
      return { ...state, followers: action.followers };

    case FETCH_USERS:
      const usersById = action.users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      return {
        ...state,
        usersById: { ...state.usersById, ...usersById },
      };

    case UPDATE_BIO:
      return {
        ...state,
        bio: action.bio, // Update the user's bio in the Redux state
      };

    default:
      return state;
  }
};


export default userReducer;
