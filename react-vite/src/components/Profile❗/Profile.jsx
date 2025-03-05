import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk, fetchFollowing, fetchFollowers } from "../../redux/user";
import styles from "./Profile.module.css";

const Profile = () => {
  const dispatch = useDispatch();

  // Fetch user data on mount
  useEffect(() => {
    dispatch(fetchUserThunk());
  }, [dispatch]);

  // Fetch followers and following when user data is available
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user.id) {
      dispatch(fetchFollowing(user.id));
      dispatch(fetchFollowers(user.id));
    }
  }, [dispatch, user.id]);

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
    <div className={styles.profileContainer}>
      {/* Top Row: Avatar, Username, Edit Button */}
      <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.avatar}>{getInitials(user.username)}</div>
        <h2 className={styles.username}>{user.username}</h2>
        <button className={styles.editButton}>Edit</button>
      </div>

      {/* Middle: Description */}
      <p className={styles.bio}>{user.bio || "Hi, I'm demo. I was created with this project, and the purpose of my existence is to help..."}</p>

      {/* Bottom: Following and Followers */}
      <div className={styles.followData}>
        <span>Following: {user.following ? user.following.length : 0}</span>
        <span>Followers: {user.followers ? user.followers.length : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
