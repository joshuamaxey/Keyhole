import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowUpRight, FiEdit2, FiLogOut } from "react-icons/fi";
import { fetchUserThunk, fetchFollowing, fetchFollowers } from "../../redux/user";
import { thunkLogout } from "../../redux/session";
import { useModal } from "../../context/Modal";
import UpdateProfileModal from "./UpdateProfileModal";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import styles from "./Profile.module.css";

export default function Profile() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const profile = useSelector(state => state.user);
  const { setModalContent } = useModal();
  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchUserThunk());
      dispatch(fetchFollowing(sessionUser.id));
      dispatch(fetchFollowers(sessionUser.id));
    }
  }, [dispatch, sessionUser]);
  if (!sessionUser) return <section className={styles.welcome}>
    <p className="eyebrow">There’s a place for you here</p>
    <h2>Come on in.</h2>
    <p>Find your people. Share what’s on your mind. Make yourself at home.</p>
    <div className={styles.authActions}><button className={styles.primary} onClick={() => setModalContent(<SignupFormModal />)}>Join Keyhole <FiArrowUpRight aria-hidden="true" /></button><button onClick={() => setModalContent(<LoginFormModal />)}>Log in</button></div>
  </section>;
  const user = profile.id === sessionUser.id ? profile : sessionUser;
  return <section className={styles.profileContainer}>
    <p className="eyebrow">Your space</p>
    <div className={styles.headerRow}><span className={styles.avatar}>{user.username.split("_").map(word => word[0]).slice(0, 2).join("")}</span><div><h2 className={styles.username}>{user.username.replaceAll("_", " ")}</h2><span className={styles.handle}>@{user.username}</span></div></div>
    <p className={styles.bio}>{user.bio || "Every story starts somewhere. Add a little about yourself."}</p>
    <div className={styles.followData}><span><strong>{user.following?.length || 0}</strong> following</span><span><strong>{user.followers?.length || 0}</strong> followers</span></div>
    <div className={styles.actions}><button onClick={() => setModalContent(<UpdateProfileModal />)}><FiEdit2 aria-hidden="true" /> Edit bio</button><button onClick={() => dispatch(thunkLogout())}><FiLogOut aria-hidden="true" /> Log out</button></div>
  </section>;
}
