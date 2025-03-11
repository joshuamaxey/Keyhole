import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk, fetchFollowing, fetchFollowers } from "../../redux/user";
import { useModal } from "../../context/Modal"; // Import useModal
import UpdateProfileModal from "./UpdateProfileModal"; // Import the modal component
import styles from "./Profile.module.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { setModalContent, openModal } = useModal(); // Access modal context

  // Select relevant states from Redux
  const user = useSelector((state) => state.user); // Current user data
  const isAuthenticated = useSelector((state) => state.session.isAuthenticated); // Track auth state

  // Fetch user data when the component mounts or auth state changes
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

  // Open the UpdateProfileModal when "EDIT" is clicked
  const handleEditClick = () => {
    setModalContent(<UpdateProfileModal />); // Set the modal content
    openModal(); // Open the modal
  };

  // Render a message if the user is not logged in
  if (!isAuthenticated) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.container}>
          <h2 className={styles.loggedOutMessage}>Log in or Sign up</h2>
          <p className={styles.loggedOutSubMessage}>
            to view your profile
          </p>
        </div>
      </div>
    );
  }

  if (!user.username) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  const getInitials = (username) => {
    return username
      .split("_")
      .map((word) => word.charAt(0))
      .join("");
  };

  return (
    <div className={styles.outerContainer}>
    <div className={styles.profileContainer}>
      {/* Top Row: Avatar, Username, Edit Button */}
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.avatar}>{getInitials(user.username)}</div>
          <h2 className={styles.username}>{user.username}</h2>
          <button className={styles.editButton} onClick={handleEditClick}>
            EDIT
          </button>
        </div>

        {/* Middle: Description */}
        <p className={styles.bio}>
          {user.bio}
        </p>

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
