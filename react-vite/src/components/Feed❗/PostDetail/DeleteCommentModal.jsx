import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkDeleteComment } from "../../../redux/comment";
import styles from "./DeleteCommentModal.module.css";

function DeleteCommentModal({ commentId, refreshComments }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    const serverResponse = await dispatch(thunkDeleteComment(commentId)); // Dispatch the delete thunk
    if (!serverResponse) {
      refreshComments(); // Refresh the comments after deletion
      closeModal(); // Close the modal
    }
  };

  return (
    <div className={styles.deleteModalContainer}>
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
      <button onClick={handleDelete} className={styles.deleteButton}>
        DELETE
      </button>
    </div>
  );

}

export default DeleteCommentModal;
