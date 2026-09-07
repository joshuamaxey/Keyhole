import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunitiesThunk } from "../../redux/community";
import CommunityCard from "./CommunityCard";
import styles from "./Communities.module.css";

export default function Communities({ onCommunitySelect, selectedCommunity }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("loading");
  const communitiesObject = useSelector(state => state.communities);
  const memberships = useSelector(state => state.communityMemberships);
  useEffect(() => {
    dispatch(fetchCommunitiesThunk()).then(() => setStatus("ready")).catch(() => setStatus("error"));
  }, [dispatch]);
  const communities = Object.values(communitiesObject).sort((a, b) => Number(memberships.some(c => c.id === b.id)) - Number(memberships.some(c => c.id === a.id)) || a.id - b.id);
  if (status === "loading") return <p role="status">Loading communities…</p>;
  if (status === "error") return <p role="alert">Communities couldn’t load. Refresh to try again.</p>;
  if (!communities.length) return <p>No communities yet.</p>;
  return <div className={styles.container}>{communities.map(community => <CommunityCard key={community.id} {...community} compact selected={selectedCommunity === community.id} members={community.members?.length || 0} isMember={memberships.some(c => c.id === community.id)} onView={() => onCommunitySelect(community.id)} />)}</div>;
}
