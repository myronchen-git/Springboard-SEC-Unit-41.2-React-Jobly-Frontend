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
      <Card>
        <CardBody>
          <CardTitle tag={'h2'}>Login</CardTitle>
          <Form className="Login__form" onSubmit={handleSubmit}>
            <FormGroup className="text-start">
              <Label htmlFor="Login__input-username">
                <b>Username</b>
              </Label>
              <Input
                id="Login__input-username"
                type="text"
                name="username"
                value={formData.username}
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="text-start">
              <Label htmlFor="Login__input-password">
                <b>Password</b>
              </Label>
              <Input
                id="Login__input-password"
                type="password"
                name="password"
                value={formData.password}
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

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default Login;
