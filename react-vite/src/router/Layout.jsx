import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowUpRight, FiHome, FiKey } from "react-icons/fi";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import { fetchCommunityMembershipsThunk, setCommunityMemberships } from "../redux/communityMemberships";
import Profile from "../components/Profile❗/Profile";
import Communities from "../components/Communities❗/Communities";
import Feed from "../components/Feed❗/Feed";
import styles from "./Layout.module.css";

export default function Layout() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [startupError, setStartupError] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetch("/api/auth/csrf/restore");
        if (!response.ok) throw new Error("Unable to initialize session");
        await dispatch(thunkAuthenticate());
      } catch {
        setStartupError(true);
      } finally {
        setIsLoaded(true);
      }
    };
    initialize();
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) dispatch(fetchCommunityMembershipsThunk(currentUser.id));
    else dispatch(setCommunityMemberships([]));
  }, [dispatch, currentUser]);

  const home = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    window.scrollTo({ top: 0 });
  };
  const selectCommunity = (id) => {
    setSelectedCommunity(id);
    setSelectedPost(null);
    document.getElementById("main-content")?.scrollIntoView({ block: "start" });
  };

  return (
    <ModalProvider>
      <a className="skip-link" href="#main-content">Skip to feed</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button className={styles.brand} onClick={home} aria-label="Keyhole home">
            <span className={styles.brandMark}><FiKey aria-hidden="true" /></span>keyhole<span className={styles.brandDot}>.</span>
          </button>
          <span className={styles.tagline}>A little window into each other’s worlds.</span>
          <a className={styles.explore} href="#communities">Find your people <FiArrowUpRight aria-hidden="true" /></a>
        </div>
      </header>
      <div className={styles.layoutContainer}>
        <aside className={styles.sidebar} aria-label="Your space and communities">
          <p className="eyebrow">Your corner of the internet</p>
          <button className={`${styles.homeLink} ${!selectedCommunity && !selectedPost ? styles.active : ""}`} onClick={home} aria-current={!selectedCommunity && !selectedPost ? "page" : undefined}>
            <FiHome aria-hidden="true" /> Home feed <span>↗</span>
          </button>
          <section id="communities" className={styles.communities} aria-labelledby="communities-heading">
            <div className={styles.sectionHeading}><h2 id="communities-heading">Communities</h2><span>Explore & connect</span></div>
            {isLoaded && <Communities onCommunitySelect={selectCommunity} selectedCommunity={selectedCommunity} />}
          </section>
          <div className={styles.profile}>{isLoaded && <Profile />}</div>
          <p className={styles.sidebarNote}>Small thoughts. Shared interests.<br />Good company.</p>
        </aside>
        <main id="main-content" className={styles.feed} tabIndex={-1}>
          {startupError ? <div className="empty-state" role="alert"><h1>We couldn’t connect.</h1><p>Check that the server is running, then try again.</p><button onClick={() => window.location.reload()}>Try again</button></div> : isLoaded ? <Feed selectedCommunity={selectedCommunity} selectedPost={selectedPost} setSelectedPost={setSelectedPost} onBackToFeed={home} /> : <p className="empty-state" role="status">Opening your window…</p>}
        </main>
      </div>
      <Modal />
    </ModalProvider>
  );
}
