import { useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import styles from "./CreateCommentModal.module.css"
import { thunkCreateComment } from "../../redux/comment";

const CreateCommentModal = ({ postId, refreshComments }) => {
    const dispatch = useDispatch();
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const serverResponse = await dispatch(thunkCreateComment(postId, content));

        if (serverResponse) {
          setErrors(serverResponse); // Display validation errors
        } else {
          if (refreshComments) {
            refreshComments(); // Only call this if it exists
          }
          closeModal(); // Close the modal
        }
      };



    return (
      <div className={styles.commentModalContainer}>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.inputField}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            required
            maxLength={500}
          />
          {errors.content && <p className={styles.error}>{errors.content}</p>}
          <button type="submit" className={styles.commentButton}>
            Comment
          </button>
        </form>
      </div>
    );
  };

  export default CreateCommentModal;
