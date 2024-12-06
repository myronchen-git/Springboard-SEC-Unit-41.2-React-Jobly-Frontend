import PropTypes from 'prop-types';
import { useState } from 'react';

import JoblyApi from '../../../api.js';

// ==================================================

/**
 * Displays a form to update and updates a user's profile.  Currently only
 * allows updating first name, last name, and email.
 *
 * @param {Object} props - React component properties.
 * @param {Object} props.user - The user Object from App.
 * @param {Function} props.setUser - Sets the new user state value in App.
 */
function Profile({ user, setUser }) {
  const initialFormData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    let updatedUser;
    try {
      updatedUser = await JoblyApi.patchUser(user.username, formData);
    } catch (err) {
      setFeedbackMessage(err[0]);
      return;
    }

    setFeedbackMessage('Profile Updated');
    setUser(updatedUser);
  }

  return (
    <main className="Profile">
      <header>
        <h1>Profile</h1>
      </header>
      <form className="Profile__form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Profile__input-firstName">First Name</label>
          <input
            id="Profile__input-firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="Profile__input-lastName">Last Name</label>
          <input
            id="Profile__input-lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="Profile__input-email">Email</label>
          <input
            id="Profile__input-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {feedbackMessage && (
          <div className="Profile__feedback">
            <p>{feedbackMessage}</p>
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

// ==================================================

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Profile;
