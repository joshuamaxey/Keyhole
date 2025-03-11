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
    <div className={styles["modal-container"]}>
      {/* <h1>Update Comment</h1> */}
      <form onSubmit={handleSubmit} className={styles["update-form"]}>
        <label className={styles["update-label"]}>
          {/* Content */}
        </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={500}
            placeholder="Update your comment content..."
            className={styles["update-textarea"]}
            />
        {errors.content && <p className={styles["update-error"]}>{errors.content}</p>}
        <button type="submit" className={styles["submit-button"]}>
          Update
        </button>
      </form>
    </div>
  );

}

export default UpdateCommentModal;
