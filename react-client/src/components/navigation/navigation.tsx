import type { FC } from 'react';
import { NavLink } from 'react-router';
import styles from './navigation.module.css';

export const Navigation: FC = () => {
  return (
    <nav>
      <ul className={styles.nav__list}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.nav__link_active : styles.nav__link
            }
          >
            Список задач
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              isActive ? styles.nav__link_active : styles.nav__link
            }
          >
            Статистика
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
