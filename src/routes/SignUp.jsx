import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <Card>
        <CardBody>
          <CardTitle tag={'h2'}>Sign Up</CardTitle>
          <Form className="SignUp__form" onSubmit={handleSubmit}>
            <FormGroup className="text-start">
              <Label htmlFor="SignUp__input-username">
                <b>Username</b>
              </Label>
              <Input
                id="SignUp__input-username"
                type="text"
                name="username"
                value={formData.username}
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="text-start">
              <Label htmlFor="SignUp__input-password">
                <b>Password</b>
              </Label>
              <Input
                id="SignUp__input-password"
                type="password"
                name="password"
                value={formData.password}
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="text-start">
              <Label htmlFor="SignUp__input-firstName">
                <b>First Name</b>
              </Label>
              <Input
                id="SignUp__input-firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="text-start">
              <Label htmlFor="SignUp__input-lastName">
                <b>Last Name</b>
              </Label>
              <Input
                id="SignUp__input-lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="text-start">
              <Label htmlFor="SignUp__input-email">
                <b>Email</b>
              </Label>
              <Input
                id="SignUp__input-email"
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
              />
            </FormGroup>
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
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

SignUp.propTypes = {
  signup: PropTypes.func.isRequired,
};

export default SignUp;
