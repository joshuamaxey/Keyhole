import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { joinCommunityThunk, leaveCommunityThunk } from "../../redux/communityMemberships";
import styles from "./CommunityCard.module.css";

const CommunityCard = ({ id, name, description, members, isMember, onView }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user); // Subscribe to session slice

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

      {/* Buttons - Only render if there is a logged-in user */}
      <div className={styles.buttons}>
        <button
          className={styles.buttonView}
          onClick={onView} // Trigger the onView prop when clicked
        >
          VIEW
        </button>
        {currentUser && ( // Conditionally render JOIN/LEAVE buttons
          isMember ? (
            <button className={styles.buttonLeave} onClick={handleLeave}>
              LEAVE
            </button>
          ) : (
            <button className={styles.buttonJoin} onClick={handleJoin}>
              JOIN
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default CommunityCard;
