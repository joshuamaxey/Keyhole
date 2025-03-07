import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import styles from "./UpdateCommentModal.module.css";
import { thunkUpdateComment } from "../../../redux/comment";

function UpdateCommentModal({ comment, refreshComments}) {
  const dispatch = useDispatch();
  const [content, setContent] = useState(comment.content); // Initialize with the current post content
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(thunkUpdateComment(comment.id, content)); // Pass post ID and new content

    if (serverResponse) {
      setErrors(serverResponse); // Display errors if any
    } else {
      refreshComments();
      closeModal(); // Close modal on success
    }
  };

  return (
    <>
      <h1>Update Comment</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={500} // Match the max length from your backend form
            placeholder="Update your comment content..."
          />
        </label>
        {errors.content && <p className={styles.error}>{errors.content}</p>} {/* Display errors for content */}
        <button type="submit" className={styles.submitButton}>Update</button>
      </form>
    </>
  );
}

export default UpdateCommentModal;
