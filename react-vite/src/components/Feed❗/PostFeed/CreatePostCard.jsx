import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreatePost } from "../../../redux/post";
import styles from "./CreatePostCard.module.css";

const CreatePostCard = ({ communityId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(""); // State for the post content
  const [errors, setErrors] = useState({}); // State for validation errors
  const currentUser = useSelector((state) => state.session.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Build postData conditionally
    const postData = {
      content,
      ...(communityId !== undefined && communityId !== null && { community_id: communityId }),
    };

    console.log("Post Data:", postData); // Debugging step to ensure correctness

    const serverResponse = await dispatch(thunkCreatePost(postData)); // Dispatch the thunk

    if (serverResponse) {
      setErrors(serverResponse); // Handle validation errors
    } else {
      setContent(""); // Clear input on success
      setErrors({});
    }
  };

  if (!currentUser) {
    return null; // Prevent rendering if the user is not logged in
  }

  return (
    <div className={styles.postCardContainer}>
      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.inputField}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        {errors.content && <p className={styles.error}>{errors.content}</p>}
        <button type="submit" className={styles.postButton}>
          POST
        </button>
      </form>
    </div>
  );
};

export default CreatePostCard;
