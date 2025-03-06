import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import styles from "./UpdateProfileModal.module.css";
import { thunkUpdateBio, fetchUserThunk } from "../../redux/user"; // Import fetchUserThunk

function UpdateProfileModal() {
  const dispatch = useDispatch();
  const [bio, setBio] = useState(""); // New bio field
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

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
    <>
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            maxLength={500} // Limit bio to 500 characters
            placeholder="Tell us a little about yourself..."
          />
        </label>
        {errors.bio && <p className={styles.error}>{errors.bio}</p>} {/* Display errors for bio */}
        <button type="submit" className={styles.submitButton}>Update</button>
      </form>
    </>
  );
}

export default UpdateProfileModal;
