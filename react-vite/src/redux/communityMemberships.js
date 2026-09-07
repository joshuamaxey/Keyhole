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
  const response = await fetch(`/api/communities/${communityId}/join`, {
    method: "POST", headers: { "X-CSRF-TOKEN": Cookies.get("XSRF-TOKEN") },
  });
  if (!response.ok) throw new Error("Unable to join community");
  await dispatch(fetchCommunityMembershipsThunk(getState().session.user.id));
};

export const leaveCommunityThunk = (communityId) => async (dispatch, getState) => {
  const response = await fetch(`/api/communities/${communityId}/leave`, {
    method: "DELETE", headers: { "X-CSRF-TOKEN": Cookies.get("XSRF-TOKEN") },
  });
  if (!response.ok) throw new Error("Unable to leave community");
  dispatch(leaveCommunity(communityId));
  await dispatch(fetchCommunityMembershipsThunk(getState().session.user.id));
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
