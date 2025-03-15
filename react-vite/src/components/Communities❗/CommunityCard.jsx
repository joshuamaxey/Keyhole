import React from "react";
import styles from "./CommunityCard.module.css";
import { useDispatch } from "react-redux";
import { joinCommunityThunk, leaveCommunityThunk } from "../../redux/communityMemberships";

const CommunityCard = ({ id, name, description, members, isMember, onView }) => {
  const dispatch = useDispatch();

  const handleJoin = () => {
    dispatch(joinCommunityThunk(id)); // Dispatch JOIN thunk
  };

  const handleLeave = () => {
    dispatch(leaveCommunityThunk(id)); // Dispatch LEAVE thunk
  };

  return (
    <div className={styles.card}>
      {/* Community Name */}
      <h3 className={styles.name}>{name}</h3>

      {/* Community Description */}
      <p className={styles.description}>{description}</p>

      {/* Member Count */}
      <p className={styles.members}>Members: {members}</p>

      {/* Buttons */}
      <div className={styles.buttons}>
        <button
          className={styles.buttonView}
          onClick={onView} // Trigger the onView prop when clicked
        >
          VIEW
        </button>
        {isMember ? (
          <button className={styles.buttonLeave} onClick={handleLeave}>
            LEAVE
          </button>
        ) : (
          <button className={styles.buttonJoin} onClick={handleJoin}>
            JOIN
          </button>
        )}
      </div>
    </div>
  );
};

export default CommunityCard;
