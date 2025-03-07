import React from "react";
import { useDispatch } from "react-redux";
import { thunkDeletePost } from "../../redux/post";
import { useModal } from "../../context/Modal";
import styles from "./DeletePostModal.module.css";

function DeletePostModal({ postId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(thunkDeletePost(postId)); // Dispatch the delete thunk
    closeModal(); // Close the modal after deleting
  };

  return (
    <div className={styles.deleteModalContainer}>
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this post? This action cannot be undone.</p>
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
