import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import styles from "./LoginFormModal.module.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className={styles["modal-container"]}>
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        <label className={styles["login-label"]}>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles["login-input"]}
          />
        </label>
        {errors.username && <p className={styles["error-message"]}>{errors.username}</p>}
        <label className={styles["login-label"]}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles["login-input"]}
          />
        </label>
        {errors.password && <p className={styles["error-message"]}>{errors.password}</p>}
        <button type="submit" className={styles["submit-button"]}>
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
