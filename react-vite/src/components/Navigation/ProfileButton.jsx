import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout, thunkLogin } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import styles from "./ProfileButton.module.css";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  const demoLogin = async () => {
    await dispatch(
      thunkLogin({
        username: "Demo_User",
        password: "password",
      })
    );
    closeMenu();
  };

  return (
    <>
      <button onClick={toggleMenu} className={styles["profile-button"]}>
        <FaUserCircle />
      </button>
      {showMenu && (
        <ul className={styles["profile-dropdown"]} ref={ulRef}>
          {user ? (
            <>
              <li>{user.username}</li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
              <li>
                <button onClick={demoLogin}>Demo User</button>
              </li>
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
