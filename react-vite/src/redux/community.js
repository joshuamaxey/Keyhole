const SET_COMMUNITIES = "communities/SET_COMMUNITIES";
const SET_COMMUNITY_MEMBERS = "community/SET_COMMUNITY_MEMBERS";
const SET_SINGLE_COMMUNITY = "communities/SET_SINGLE_COMMUNITY";

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

export const setSingleCommunity = (community) => ({
  type: SET_SINGLE_COMMUNITY,
  community,
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

export const fetchSingleCommunityThunk = (communityId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/communities/${communityId}`);
    if (response.ok) {
      const community = await response.json();
      dispatch(setSingleCommunity(community));
    } else {
      console.error(`Failed to fetch community with ID ${communityId}:`, response.status);
    }
  } catch (error) {
    console.error("An error occurred while fetching the community:", error);
  }
};


// Initial State
const initialState = [];

// Reducer
const communitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COMMUNITIES:
      return action.communities.reduce((acc, community) => {
        acc[community.id] = { ...community, members: [] };
        return acc;
      }, {});

    case SET_COMMUNITY_MEMBERS: {
      const { communityId, members } = action;
      return {
        ...state,
        [communityId]: {
          ...state[communityId],
          members,
        },
      };
    }

    case SET_SINGLE_COMMUNITY: {
      const { community } = action;
      return {
        ...state,
        [community.id]: { ...community, members: state[community.id]?.members || [] }, // Keep existing members if available
      };
    }

    default:
      return state;
  }
};

export default communitiesReducer;
