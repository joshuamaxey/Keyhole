import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk, fetchFollowing, fetchFollowers } from "../../redux/user";
import { thunkLogout } from "../../redux/session";
import { useModal } from "../../context/Modal";
import UpdateProfileModal from "./UpdateProfileModal";
import styles from "./Profile.module.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated);
  const { setModalContent, openModal } = useModal();
  const [showMenu, setShowMenu] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef();

  // Fetch user data on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserThunk());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch followers and following when user data is available
  useEffect(() => {
    if (user.id) {
      dispatch(fetchFollowing(user.id));
      dispatch(fetchFollowers(user.id));
    }
  }, [dispatch, user.id]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  // Handle dropdown toggling
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  // Handle log out functionality
  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    setShowMenu(false); // Close the dropdown after logging out
  };

  // Handle edit profile modal
  const handleEditClick = () => {
    setModalContent(<UpdateProfileModal />);
    openModal();
  };

  const getInitials = (username) => {
    return username
      .split("_")
      .map((word) => word.charAt(0))
      .join("");
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.container}>
          <h2 className={styles.loggedOutMessage}>
            <span className={styles.inlineLink}>
              <OpenModalMenuItem
                itemText="Log in"
                modalComponent={<LoginFormModal />}
              />
            </span>
            {" or "}
            <span className={styles.inlineLink}>
              <OpenModalMenuItem
                itemText="Sign up"
                modalComponent={<SignupFormModal />}
              />
            </span>
          </h2>
          <p className={styles.loggedOutSubMessage}>
            to view your profile
          </p>
        </div>
      </div>
    );
  }


  if (!user.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.container}>
          {/* Top Row: Avatar, Username, Edit Button */}
          <div className={styles.headerRow}>
            {/* Avatar with Dropdown Menu */}
            <div className={styles.avatarContainer}>
              <div
                className={styles.avatar}
                onClick={toggleMenu} // Toggle the dropdown on click
                ref={dropdownRef}
              >
                {getInitials(user.username)}
              </div>

              {/* Dropdown Menu */}
              {showMenu && (
                <ul className={styles.dropdownMenu}>
                  <li>{user.username}</li>
                  <li>
                    <button onClick={logout} className={styles.logoutButton}>
                      Log Out
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <h2 className={styles.username}>{user.username}</h2>
            <button className={styles.editButton} onClick={handleEditClick}>
              ...
            </button>
          </div>

          {/* Middle: Description */}
          <p className={styles.bio}>{user.bio}</p>

          {/* Bottom: Following and Followers */}
          <div className={styles.followData}>
            <span>Following: {user.following ? user.following.length : 0}</span>
            <span>Followers: {user.followers ? user.followers.length : 0}</span>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Profile;
