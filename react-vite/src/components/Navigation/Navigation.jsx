import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import styles from "./Navigation.module.css";

function Navigation() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink to="/" className={styles.navLink}>
            Keyhole
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
