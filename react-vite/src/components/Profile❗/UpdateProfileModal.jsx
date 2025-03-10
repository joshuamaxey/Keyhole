import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Use selector to fetch current user data
import { useModal } from "../../context/Modal";
import styles from "./UpdateProfileModal.module.css";
import { thunkUpdateBio, fetchUserThunk } from "../../redux/user"; // Import fetchUserThunk

function UpdateProfileModal() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user); // Fetch current user from Redux store
  const [bio, setBio] = useState(""); // New bio field
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (currentUser && currentUser.bio) {
      setBio(currentUser.bio); // Pre-load the existing bio if available
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(thunkUpdateBio(bio)); // Pass `bio` directly

    if (serverResponse) {
      setErrors(serverResponse); // Display errors if any
    } else {
      // Trigger the fetchUserThunk to refresh the user's profile data
      await dispatch(fetchUserThunk());
      closeModal(); // Close modal on success
    }
  };

  return (
    <div className={styles["modal-container"]}>
      <form onSubmit={handleSubmit} className={styles["modal-form"]}>
        <label className={styles["modal-label"]}>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            maxLength={500}
            placeholder="Tell us a little about yourself..."
            className={styles["modal-textarea"]}
          />
        </label>
        {errors.bio && <p className={styles.error}>{errors.bio}</p>}
        <button type="submit" className={styles.submitButton}>
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateProfileModal;
