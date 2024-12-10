import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import './HomePage.css';

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
    <main className="HomePage">
      <h1>Jobly</h1>
      <p>All the jobs in one, convenient place.</p>
      {username ? (
        <div className="HomePage__welcome-back-message">
          <p>Welcome Back, {username}!</p>
        </div>
      ) : (
        <div>
          <Link className="m-2" to="/login">
            <Button color="light">Log In</Button>
          </Link>
          <Link className="m-2" to="/signup">
            <Button color="light">Sign Up</Button>
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
