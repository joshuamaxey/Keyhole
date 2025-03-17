import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { generateUsername } from "unique-username-generator";
import styles from "./SignupFormModal.module.css"

function SignupFormModal() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkUsernameExists = async (username) => {
    const response = await fetch(`/api/users/exists?username=${username}`);
    const data = await response.json();
    return data.exists; // Adjust the response based on your actual API endpoint
  };

  useEffect(() => {
    const generateUniqueUsername = async () => {
      let newUsername = generateUsername("_");

      // Function to capitalize each word
      const capitalizeWords = (username) => {
        return username
          .split("_") // Split the username by "_"
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
          .join("_"); // Join the words back with "_"
      };

      while (await checkUsernameExists(newUsername)) {
        newUsername = generateUsername("_");
      }

      newUsername = capitalizeWords(newUsername); // Capitalize the username
      setUsername(newUsername);
    };

    generateUniqueUsername();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Local validation for password match
    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    setIsSubmitting(true);
    // Include `confirmPassword` in the payload
    const serverResponse = await dispatch(
      thunkSignup({
        username,
        bio,
        password,
        confirm_password: confirmPassword, // Send to the backend
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles["signup-modal-container"]}>
      {errors.server && <p className={styles["signup-server-error"]}>{errors.server}</p>}
      <form onSubmit={handleSubmit} className={styles["signup-form"]}>
        <div>
          <label className={styles["signup-label"]}>
            Username
            <p className={styles.userName}>{username}</p>
          </label>
        </div>
        {errors.username && <p className={styles["signup-error"]}>{errors.username}</p>}

        <label className={styles["signup-label"]}>
        <span>Bio ({bio.length}/250)</span>
        </label>
        <textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength="250"
          rows="5"
          className={styles["signup-textarea"]}
        />
        {errors.bio && <p className={styles["signup-error"]}>{errors.bio}</p>}
        <br></br>
        <label className={styles["signup-label"]}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles["signup-input"]}
          />
        </label>
        {errors.password && <p className={styles["signup-error"]}>{errors.password}</p>}
        <br></br>
        <label className={styles["signup-label"]}>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles["signup-input"]}
          />
        </label>
        {errors.confirmPassword && <p className={styles["signup-error"]}>{errors.confirmPassword}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles["signup-submit-button"]}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
