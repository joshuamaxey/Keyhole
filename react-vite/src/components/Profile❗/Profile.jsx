import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk } from "../../redux/user";

const Profile = () => {
  const dispatch = useDispatch();

  // Fetch user data on mount
  useEffect(() => {
    dispatch(fetchUserThunk());
  }, [dispatch]);

  // Select user data from Redux store
  const user = useSelector((state) => state.user);

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
    <div>
      {/* Avatar with initials */}
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {getInitials(user.username)}
      </div>

      {/* User info */}
      <div>
        <h2>{user.username}</h2>
        <p>{user.bio || "No bio available"}</p>
        <p>
          Following: {user.following || 0} | Followers: {user.followers || 0}
        </p>
      </div>

      {/* Edit Button */}
      <button>Edit</button>
    </div>
  );
};

export default Profile;
