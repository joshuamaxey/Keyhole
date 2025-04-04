import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import userReducer from "./user";
import communitiesReducer from "./community";
import postReducer from "./post";
import commentReducer from "./comment";
import communityMembershipsReducer from "./communityMemberships";
import likeReducer from "./postLike";
import commentLikeReducer from "./commentLike";

const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  communities: communitiesReducer,
  posts: postReducer,
  comments: commentReducer,
  communityMemberships: communityMembershipsReducer,
  likes: likeReducer,
  commentLikes: commentLikeReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
