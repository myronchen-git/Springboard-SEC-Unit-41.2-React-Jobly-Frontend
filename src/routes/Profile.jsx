import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

import JoblyApi from '../api.js';

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
  const [feedbackMessage, setFeedbackMessage] = useState({});

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
      setFeedbackMessage({ type: 'danger', message: err[0] });
      return;
    }

    setFeedbackMessage({ type: 'success', message: 'Profile Updated' });
    setUser(updatedUser);
  }

  return (
    <main className="Profile">
      <Card>
        <CardBody>
          <CardTitle tag={'h2'}>Profile</CardTitle>
          <Form className="Profile__form" onSubmit={handleSubmit}>
            <FormGroup className="text-start">
              <Label htmlFor="Profile__input-firstName">
                <b>First Name</b>
              </Label>
              <Input
                id="Profile__input-firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="text-start">
              <Label htmlFor="Profile__input-lastName">
                <b>Last Name</b>
              </Label>
              <Input
                id="Profile__input-lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="text-start">
              <Label htmlFor="Profile__input-email">
                <b>Email</b>
              </Label>
              <Input
                id="Profile__input-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormGroup>
            {feedbackMessage.message && (
              <Alert color={feedbackMessage.type}>
                {feedbackMessage.message}
              </Alert>
            )}
            <Button color="light" type="submit">
              Submit
            </Button>
          </Form>
        </CardBody>
      </Card>
    </main>
  );
}

// ==================================================

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Profile;
