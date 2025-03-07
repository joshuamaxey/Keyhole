import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import styles from "./UpdatePostModal.module.css";
import { thunkUpdatePost } from "../../redux/post";

function UpdatePostModal({ post }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState(post.content); // Initialize with the current post content
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(thunkUpdatePost(post.id, content)); // Pass post ID and new content

    if (serverResponse) {
      setErrors(serverResponse); // Display errors if any
    } else {
      closeModal(); // Close modal on success
    }
  };

  return (
    <>
      <h1>Update Post</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={500} // Match the max length from your backend form
            placeholder="Update your post content..."
          />
        </label>
        {errors.content && <p className={styles.error}>{errors.content}</p>} {/* Display errors for content */}
        <button type="submit" className={styles.submitButton}>Update</button>
      </form>
    </>
  );
}

export default UpdatePostModal;
