const FETCH_USER = "user/FETCH_USER";

// Action Creator
export const fetchUser = (user) => ({
  type: FETCH_USER,
  user,
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


// Initial State
const initialState = {};

// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, ...action.user };
    default:
      return state;
  }
};

export default userReducer;
