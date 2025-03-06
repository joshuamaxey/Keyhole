import React from "react";
import styles from "./CommunityCard.module.css";

const CommunityCard = ({ name, description, members }) => {
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
        <button className={styles.buttonView}>VIEW</button>
        <button className={styles.buttonJoin}>JOIN</button>
      </div>
    </div>
  );
};

export default CommunityCard;
