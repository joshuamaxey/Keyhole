const SET_COMMUNITIES = "communities/SET_COMMUNITIES";
const SET_COMMUNITY_MEMBERS = "community/SET_COMMUNITY_MEMBERS";

// Action Creators
export const setCommunities = (communities) => ({
  type: SET_COMMUNITIES,
  communities,
});

export const setCommunityMembers = (communityId, members) => ({
    type: SET_COMMUNITY_MEMBERS,
    communityId,
    members,
});

// Thunk Actions
export const fetchCommunitiesThunk = () => async (dispatch) => {
    const response = await fetch("/api/communities");
    if (response.ok) {
      const data = await response.json();
      console.log("Communities fetched from backend:", data.communities);
      dispatch(setCommunities(data.communities));
    } else {
      console.error("Failed to fetch communities:", response.status);
    }
};

export const fetchCommunityMembersThunk = (communityId) => async (dispatch) => {
    const response = await fetch(`/api/communities/${communityId}/members`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setCommunityMembers(communityId, data.members));
    } else {
      console.error("Failed to fetch community members");
    }
};

// Initial State
const initialState = [];

// Reducer
const communitiesReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_COMMUNITIES:
        // Set the initial list of communities
        return action.communities.reduce((acc, community) => {
          acc[community.id] = { ...community, members: [] }; // Add an empty members array
          return acc;
        }, {});

      case SET_COMMUNITY_MEMBERS: {
        // Update the members array for a specific community
        const { communityId, members } = action;
        return {
          ...state,
          [communityId]: {
            ...state[communityId],
            members,
          },
        };
      }

      default:
        return state;
    }
  };


export default communitiesReducer;
