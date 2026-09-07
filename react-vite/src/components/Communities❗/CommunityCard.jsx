import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiArrowUpRight, FiHash, FiCheck } from "react-icons/fi";
import { joinCommunityThunk, leaveCommunityThunk } from "../../redux/communityMemberships";
import { fetchCommunityMembersThunk } from "../../redux/community";
import styles from "./CommunityCard.module.css";

export default function CommunityCard({ id, name, description, members, isMember, onView, compact, selected }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const toggleMembership = async () => {
    setBusy(true); setError("");
    try {
      await dispatch(isMember ? leaveCommunityThunk(id) : joinCommunityThunk(id));
      await dispatch(fetchCommunityMembersThunk(id));
    } catch { setError("Couldn’t update membership. Please try again."); }
    finally { setBusy(false); }
  };
  if (compact) return <button className={`${styles.compact} ${selected ? styles.selected : ""}`} onClick={onView} aria-current={selected ? "page" : undefined}>
    <span className={styles.icon} data-tone={id % 3}><FiHash aria-hidden="true" /></span>
    <span className={styles.compactText}><strong>{name}</strong><small>{isMember ? "Joined" : `${members} members`}</small></span>
    {isMember ? <FiCheck className={styles.arrow} aria-label="Joined" /> : <FiArrowUpRight className={styles.arrow} aria-hidden="true" />}
  </button>;
  return <section className={styles.card}>
    <span className={styles.icon} data-tone={id % 3}><FiHash aria-hidden="true" /></span>
    <h2 className={styles.name}>{name}</h2>
    <p className={styles.description}>{description}</p>
    <div className={styles.buttons}><span className={styles.members}>{members} members</span>{currentUser && <button disabled={busy} onClick={toggleMembership}>{busy ? "Updating…" : isMember ? "Leave community" : "Join community"}</button>}</div>
    {error && <p role="alert">{error}</p>}
  </section>;
}
