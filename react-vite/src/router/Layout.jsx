import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Profile from "../components/Profile❗/Profile";
import Communities from "../components/Communities❗/Communities";
import Feed from "../components/Feed❗/Feed";
import styles from "./Layout.module.css";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Authenticate the user
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // Restore CSRF Token
  useEffect(() => {
    const restoreCSRF = async () => {
      try {
        const response = await fetch("/api/auth/csrf/restore", { method: "GET" });
        if (!response.ok) {
          console.error("Failed to restore CSRF token");
        }
      } catch (err) {
        console.error("Error restoring CSRF token:", err);
      }
    };

    restoreCSRF();
  }, []);

  const handleCommunitySelect = (communityId) => {
    setSelectedCommunity(communityId);
    setSelectedPost(null);
  }

  const handleBackToFeed = () => {
    setSelectedCommunity(null); // Reset the selected community
  };

  return (
    <>
      <ModalProvider>
        <div className={styles.layoutContainer}>
          <div className={styles.profile}>
            <Profile />
          </div>
          <div className={styles.communities}>
            <Communities onCommunitySelect={handleCommunitySelect} />
          </div>
          <div className={styles.feed}>
            <Feed
              selectedCommunity={selectedCommunity}
              setSelectedCommunity={setSelectedCommunity}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              onBackToFeed={handleBackToFeed}
            />
          </div>
        </div>
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}
