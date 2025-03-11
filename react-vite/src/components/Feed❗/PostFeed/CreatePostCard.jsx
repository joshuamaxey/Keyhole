import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreatePost } from "../../../redux/post";
import styles from "./CreatePostCard.module.css";

const CreatePostCard = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(""); // State for the post content
  const [errors, setErrors] = useState({}); // State for validation errors
  const currentUser = useSelector((state) => state.session.user)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = { content }; // Only content is required here
    const serverResponse = await dispatch(thunkCreatePost(postData)); // Dispatch the thunk

    if (serverResponse) {
      setErrors(serverResponse); // Handle validation errors from the server
    } else {
      setContent(""); // Clear the input field on success
      setErrors({}); // Clear errors on success
    }
  };

  if (!currentUser) {
    return;
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
