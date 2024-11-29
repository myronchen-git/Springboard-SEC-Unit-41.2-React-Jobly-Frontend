import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// ==================================================

/**
 * Displays the navigation bar.
 *
 * @param {Object} props - React component properties.
 * @param {String} props.username - Username of the logged in user, otherwise
 *   falsy.
 * @param {Function} props.logout - Logs out the current user.
 */
function NavBar({ username, logout }) {
  return (
    <nav className="NavBar">
      <NavLink to="/">Home</NavLink>
      {username ? (
        <>
          <NavLink to="/companies" end>
            Companies
          </NavLink>
          <NavLink to="/jobs" end>
            Jobs
          </NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/" onClick={logout}>
            Logout {username}
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
    </nav>
  );
}

// ==================================================

NavBar.propTypes = {
  username: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

export default NavBar;
