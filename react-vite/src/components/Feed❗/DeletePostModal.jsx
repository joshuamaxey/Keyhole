import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkDeletePost } from "../../redux/post";
import { useModal } from "../../context/Modal";
import styles from "./DeletePostModal.module.css";

function DeletePostModal({ postId, onBack }) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { closeModal } = useModal();

  const handleDelete = async () => {
    const result = await dispatch(thunkDeletePost(postId));
    if (result) { setError(result.error || result.server || "Couldn’t delete post."); return; }
    closeModal();
    onBack?.();
  };

  return (
    <div className={styles.deleteModalContainer}>
      <h2 className={styles.deletePostModalTitle}>Confirm Deletion</h2>
      <p className={styles.deletePostModalContent}>Are you sure you want to delete this post? This action cannot be undone.</p>
      {error && <p role="alert">{error}</p>}
      <button
        onClick={handleDelete}
        className={styles.deleteButton}
      >
        DELETE
      </button>
    </div>
  );
}

export default DeletePostModal;
