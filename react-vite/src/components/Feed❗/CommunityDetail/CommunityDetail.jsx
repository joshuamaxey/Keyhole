import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsThunk } from "../../../redux/post";
import CommunityCard from "../../Communities❗/CommunityCard";
import PostCard from "../PostFeed/PostCard";
import styles from "./CommunityDetail.module.css";

export default function CommunityDetail({ communityId, onBack, onPostClick, composer }) {
  const dispatch = useDispatch();
  const allPosts = useSelector(state => state.posts.posts);
  const status = useSelector(state => state.posts.status);
  const community = useSelector(state => state.communities[communityId]);
  const currentUser = useSelector(state => state.session.user);
  const memberships = useSelector(state => state.communityMemberships);
  useEffect(() => { if (status === "idle") dispatch(fetchPostsThunk()); }, [dispatch, status]);
  if (!community) return <p role="status">Loading community…</p>;
  const posts = allPosts.filter(post => post.community_id === communityId);
  return <div className={styles.communityDetailContainer}>
    <button onClick={onBack} className={styles.backButton}>← Home feed</button>
    <CommunityCard {...community} members={community.members?.length || 0} isMember={memberships.some(item => item.id === communityId)} />
    {composer}
    <h2 className={styles.postsHeading}>Community conversations</h2>
    {status === "loading" && <p className="empty-state" role="status">Loading conversations…</p>}
    {status === "failed" && <div className="empty-state" role="alert"><p>Couldn’t load conversations.</p><button onClick={() => dispatch(fetchPostsThunk())}>Try again</button></div>}
    <div className={styles.postsWrapper}>{posts.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} onClick={() => onPostClick(post)} />)}</div>
    {status === "succeeded" && !posts.length && <p className="empty-state">No conversations yet. {composer ? "Start one above." : "Join this community to share the first thought."}</p>}
  </div>;
}
