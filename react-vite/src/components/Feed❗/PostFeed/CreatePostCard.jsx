import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreatePost } from "../../../redux/post";
import styles from "./CreatePostCard.module.css";

const CreatePostCard = ({ communityId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState(""); // State for the post content
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); // State for validation errors
  const currentUser = useSelector((state) => state.session.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Build postData conditionally
    const postData = {
      content,
      ...(communityId !== undefined && communityId !== null && { community_id: communityId }),
    };

    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const serverResponse = await dispatch(thunkCreatePost(postData)); // Dispatch the thunk

    setIsSubmitting(false);
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
        <label htmlFor="new-post" className={styles.label}>A thought to share?</label>
        <textarea
          id="new-post"
          maxLength={500}
          className={styles.inputField}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        {errors.content && <p className={styles.error}>{errors.content}</p>}
        {errors.server && <p role="alert" className={styles.error}>{errors.server}</p>}
        <div className={styles.composerFooter}><span>{communityId ? "Posting to this community" : "Sharing with everyone"} · {content.length}/500</span><button type="submit" className={styles.postButton} disabled={!content.trim() || isSubmitting}>{isSubmitting ? "Posting…" : "Share thought ↗"}</button></div>
      </form>
    </div>
  );
};

export default CreatePostCard;
