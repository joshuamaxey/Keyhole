import Cookies from "js-cookie";

// Action Types
const SET_COMMUNITY_MEMBERSHIPS = "communityMemberships/SET_COMMUNITY_MEMBERSHIPS";
const JOIN_COMMUNITY = "communityMemberships/JOIN_COMMUNITY";
const LEAVE_COMMUNITY = "communityMemberships/LEAVE_COMMUNITY";

// Action Creators
export const setCommunityMemberships = (communities) => ({
  type: SET_COMMUNITY_MEMBERSHIPS,
  communities,
});

export const joinCommunity = (community) => ({
  type: JOIN_COMMUNITY,
  community,
});

export const leaveCommunity = (communityId) => ({
  type: LEAVE_COMMUNITY,
  communityId,
});

// Thunks
export const fetchCommunityMembershipsThunk = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}/communities`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setCommunityMemberships(data.communities));
    } else {
      console.error("Failed to fetch community memberships.");
    }
  } catch (err) {
    console.error("Error fetching community memberships:", err);
  }
};

export const joinCommunityThunk = (communityId) => async (dispatch, getState) => {
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(joinCommunity(data)); // Update Redux state
        // Optionally refetch memberships to ensure complete synchronization
        const userId = getState().session.user.id;
        dispatch(fetchCommunityMembershipsThunk(userId));
      } else {
        const error = await response.json();
        console.error("Failed to join the community:", error.message);
      }
    } catch (err) {
      console.error("Error joining the community:", err);
    }
  };


  export const leaveCommunityThunk = (communityId) => async (dispatch, getState) => {
    try {
      const response = await fetch(`/api/communities/${communityId}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": Cookies.get("XSRF-TOKEN"),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Optional: Log the success message
        dispatch(leaveCommunity(communityId)); // Remove the community from Redux state

        // Re-fetch memberships to ensure synchronization
        const userId = getState().session.user.id;
        dispatch(fetchCommunityMembershipsThunk(userId));
      } else {
        const error = await response.json();
        console.error("Failed to leave the community:", error.message);
      }
    } catch (err) {
      console.error("Error leaving the community:", err);
    }
  };


// Reducer
const initialState = [];

const communityMembershipsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COMMUNITY_MEMBERSHIPS:
      return action.communities;

    case JOIN_COMMUNITY:
      return [...state, action.community];

    case LEAVE_COMMUNITY:
      return state.filter((community) => community.id !== action.communityId);

    default:
      return state;
  }
};

export default communityMembershipsReducer
