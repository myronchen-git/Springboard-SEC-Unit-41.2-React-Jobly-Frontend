import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'reactstrap';

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
    <Navbar className="NavBar" color="light" light>
      <NavLink className="navbar-brand" to="/">
        Home
      </NavLink>
      <Nav>
        {username ? (
          <>
            <NavItem>
              <NavLink className="nav-link link-secondary" to="/companies" end>
                Companies
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link link-secondary" to="/jobs" end>
                Jobs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link link-secondary" to="/profile">
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className="nav-link link-secondary"
                to="/"
                onClick={logout}
              >
                Logout {username}
              </NavLink>
            </NavItem>
          </>
        ) : (
          <>
            <NavItem>
              <NavLink className="nav-link link-secondary" to="/login">
                Login
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link link-secondary" to="/signup">
                Sign Up
              </NavLink>
            </NavItem>
          </>
        )}
      </Nav>
    </Navbar>
  );
}

// ==================================================

NavBar.propTypes = {
  username: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

export default NavBar;
