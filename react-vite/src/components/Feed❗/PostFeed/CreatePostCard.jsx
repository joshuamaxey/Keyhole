import React, { useState } from "react";
import styles from "./CreatePostCard.module.css";

const CreatePostCard = () => {
  const [postText, setPostText] = useState("");

  const handlePostSubmit = () => {
    // Logic for submitting the post
    console.log("Post submitted:", postText);
    setPostText(""); // Clear input after submission
  };

  return (
    <div className={styles.postCardContainer}>
      {/* Input Field */}
      <textarea
        className={styles.inputField}
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="What's on your mind...?"
      />

      {/* Post Button */}
      <button className={styles.postButton} onClick={handlePostSubmit}>
        POST
      </button>
    </div>
  );
};

export default CreatePostCard;
