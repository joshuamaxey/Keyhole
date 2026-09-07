import { useSelector } from "react-redux";
import styles from "./Feed.module.css";
import CreatePostCard from "./PostFeed/CreatePostCard";
import PostFeed from "./PostFeed/PostFeed";
import PostDetail from "./PostDetail/PostDetail";
import CommunityDetail from "./CommunityDetail/CommunityDetail";

export default function Feed({ selectedCommunity, selectedPost, setSelectedPost, onBackToFeed }) {
  const currentUser = useSelector(state => state.session.user);
  const memberships = useSelector(state => state.communityMemberships);
  const community = useSelector(state => state.communities[selectedCommunity]);
  const latestPost = useSelector(state => state.posts.posts.find(post => post.id === selectedPost?.id));
  const isMember = memberships.some(item => item.id === selectedCommunity);
  return (
    <div className={styles.feedContainer}>
      <header className={styles.heading}>
        <p className="eyebrow">{selectedPost ? "A closer look" : selectedCommunity ? "A shared interest" : "The everyday, shared"}</p>
        <h1>{selectedPost ? "In conversation." : selectedCommunity ? community?.name || "Community" : "A world worth peeking into."}</h1>
        <p>{selectedPost ? "A thought is just the beginning. Keep the conversation going." : selectedCommunity ? "A place for people who share your curiosity." : currentUser ? "The latest from your communities, and a few thoughts from everyone." : "Discover small stories, big ideas, and people who see things a little like you."}</p>
      </header>
      {selectedPost ? <PostDetail post={latestPost || selectedPost} onBack={() => setSelectedPost(null)} /> : selectedCommunity ? <>
        <CommunityDetail communityId={selectedCommunity} onBack={onBackToFeed} onPostClick={setSelectedPost} composer={isMember ? <CreatePostCard communityId={selectedCommunity} /> : null} />
      </> : <>
        <CreatePostCard />
        <div className={styles.feedLabel}><h2>{currentUser ? "Your feed" : "Community feed"}</h2><span><i /> Fresh perspectives</span></div>
        <PostFeed onPostClick={setSelectedPost} currentUser={currentUser} />
      </>}
    </div>
  );
}
