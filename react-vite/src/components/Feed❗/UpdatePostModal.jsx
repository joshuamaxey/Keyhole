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
    <div className={styles["modal-container"]}>
      {/* <h1>Update Post</h1> */}
      <form onSubmit={handleSubmit} className={styles["update-form"]}>
        <label className={styles["update-label"]}>
          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={500}
            placeholder="Update your post content..."
            className={styles["update-textarea"]}
          />
        </label>
        {errors.content && <p className={styles["update-error"]}>{errors.content}</p>}
        <button type="submit" className={styles["update-submit-button"]}>
          Update
        </button>
      </form>
    </div>
  );

}

export default UpdatePostModal;
