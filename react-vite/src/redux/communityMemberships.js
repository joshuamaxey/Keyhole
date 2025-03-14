const SET_COMMUNITY_MEMBERSHIPS = "communityMemberships/SET_COMMUNITY_MEMBERSHIPS";

export const setCommunityMemberships = (communities) => ({
    type: SET_COMMUNITY_MEMBERSHIPS,
    communities,
  });

  export const fetchCommunityMembershipsThunk = (userId) => async (dispatch) => {
    try {
      const response = await fetch(`/api/users/${userId}/communities`);
      if (response.ok) {
        const data = await response.json();
        dispatch(setCommunityMemberships(data.communities)); // Dispatch action with fetched data
      } else {
        console.error("Failed to fetch community memberships.");
      }
    } catch (error) {
      console.error("Error fetching community memberships:", error);
    }
  };

  const initialState = [];

 const communityMembershipsReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_COMMUNITY_MEMBERSHIPS:
        return action.communities; // Replace the state with the new memberships array

      default:
        return state; // Return the unchanged state for unknown actions
    }
  };

export default communityMembershipsReducer;
