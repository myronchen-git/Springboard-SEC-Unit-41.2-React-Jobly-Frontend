import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ==================================================

/**
 * Displays and handles the account login form.
 *
 * @param {Object} props - React component properties.
 * @param {Function} props.login - Does the logging in.
 */
function Login({ login }) {
  const initialFormData = {
    username: '',
    password: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    try {
      await login(formData);
    } catch (err) {
      setErrorMessage(err[0]);
      return;
    }

    navigate('/');
  }

  return (
    <main className="Login">
      <header>
        <h1>Login</h1>
      </header>
      <form className="Login__form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Login__input-username">Username</label>
          <input
            id="Login__input-username"
            type="text"
            name="username"
            value={formData.username}
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="Login__input-password">Password</label>
          <input
            id="Login__input-password"
            type="password"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
          />
        </div>
        {errorMessage && (
          <div className="Login__error">
            <p>{errorMessage}</p>
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

// ==================================================

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default Login;
