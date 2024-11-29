import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ==================================================

/**
 * Displays and handles the account registration form.
 *
 * @param {Object} props - React component properties.
 * @param {Function} props.signup - Does the signing up.
 */
function SignUp({ signup }) {
  const initialFormData = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    try {
      await signup(formData);
    } catch (err) {
      setErrorMessage(err[0]);
      return;
    }

    navigate('/');
  }

  return (
    <main className="SignUp">
      <header>
        <h1>Sign Up</h1>
      </header>
      <form className="SignUp__form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="SignUp__input-username">Username</label>
          <input
            id="SignUp__input-username"
            type="text"
            name="username"
            value={formData.username}
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="SignUp__input-password">Password</label>
          <input
            id="SignUp__input-password"
            type="password"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="SignUp__input-firstName">First Name</label>
          <input
            id="SignUp__input-firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="SignUp__input-lastName">Last Name</label>
          <input
            id="SignUp__input-lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            required
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="SignUp__input-email">Email</label>
          <input
            id="SignUp__input-email"
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />
        </div>
        {errorMessage && (
          <div className="SignUp__error">
            <p>{errorMessage}</p>
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

// ==================================================

SignUp.propTypes = {
  signup: PropTypes.func.isRequired,
};

export default SignUp;
