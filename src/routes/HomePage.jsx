import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// ==================================================

/**
 * Displays the home page.  Displays different views depending on whether a
 * user is logged in or not.
 *
 * @param {Object} props - React component properties.
 * @param {String} props.username - Username of the logged in user, otherwise
 *   falsy.
 */
function HomePage({ username }) {
  return (
    <main>
      <h1>Jobly</h1>
      <p>All the jobs in one, convenient place.</p>
      {username ? (
        <div>
          <p>Welcome Back, {username}!</p>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button type="button">Log In</button>
          </Link>
          <Link to="/signup">
            <button type="button">Sign Up</button>
          </Link>
        </div>
      )}
    </main>
  );
}

// ==================================================

HomePage.propTypes = {
  username: PropTypes.string,
};

export default HomePage;
