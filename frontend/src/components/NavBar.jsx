import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// ==================================================

function NavBar({ isLoggedIn = false }) {
  return (
    <nav className="NavBar">
      <NavLink to="/">Home</NavLink>
      {isLoggedIn ? (
        <>
          <NavLink to="/companies" end>
            Companies
          </NavLink>
          <NavLink to="/jobs" end>
            Jobs
          </NavLink>
          <NavLink to="/profile">Profile</NavLink>
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
  isLoggedIn: PropTypes.bool.isRequired,
};

export default NavBar;
