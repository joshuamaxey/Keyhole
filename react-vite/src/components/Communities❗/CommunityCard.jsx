import React from "react";
import styles from "./CommunityCard.module.css";
import { useSelector } from "react-redux";

const CommunityCard = ({ name, description, members, onView }) => {
  const currentUser = useSelector((state) => state.session.user);

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
        {currentUser && (
          <button className={styles.buttonJoin}>JOIN</button>
        )}
      </div>
    </div>
  );
};

export default CommunityCard;
