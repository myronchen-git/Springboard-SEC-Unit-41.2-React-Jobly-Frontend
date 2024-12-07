import { act, fireEvent, render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SignUp from './SignUp.jsx';

// ==================================================

vi.mock('react-router-dom');

// ==================================================

describe('SignUp', () => {
  const formData = Object.freeze({
    username: 'user1',
    password: '12345',
    firstName: 'First',
    lastName: 'Last',
    email: 'email@email.com',
  });

  const mockSignup = vi.fn();
  const mockNavigate = vi.fn();
  useNavigate.mockReturnValue(mockNavigate);

  beforeEach(() => {
    mockSignup.mockReset();
    mockNavigate.mockReset();
  });

  it('renders.', () => {
    render(<SignUp signup={mockSignup} />);
  });

  it('matches snapshot.', () => {
    const { asFragment } = render(<SignUp signup={mockSignup} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('can update form data.', () => {
    // Arrange
    const { getByLabelText } = render(<SignUp signup={mockSignup} />);

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const firstNameInput = getByLabelText('First Name');
    const lastNameInput = getByLabelText('Last Name');
    const emailInput = getByLabelText('Email');

    // Act
    fireEvent.change(usernameInput, { target: { value: formData.username } });
    fireEvent.change(passwordInput, { target: { value: formData.password } });
    fireEvent.change(firstNameInput, { target: { value: formData.firstName } });
    fireEvent.change(lastNameInput, { target: { value: formData.lastName } });
    fireEvent.change(emailInput, { target: { value: formData.email } });

    // Assert
    expect(usernameInput).toHaveValue(formData.username);
    expect(passwordInput).toHaveValue(formData.password);
    expect(firstNameInput).toHaveValue(formData.firstName);
    expect(lastNameInput).toHaveValue(formData.lastName);
    expect(emailInput).toHaveValue(formData.email);

    expect(mockSignup).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('can submit form data.', async () => {
    // Arrange
    const { getByLabelText, getByText } = render(
      <SignUp signup={mockSignup} />
    );

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const firstNameInput = getByLabelText('First Name');
    const lastNameInput = getByLabelText('Last Name');
    const emailInput = getByLabelText('Email');
    const submitBtn = getByText('Submit');

    fireEvent.change(usernameInput, { target: { value: formData.username } });
    fireEvent.change(passwordInput, { target: { value: formData.password } });
    fireEvent.change(firstNameInput, { target: { value: formData.firstName } });
    fireEvent.change(lastNameInput, { target: { value: formData.lastName } });
    fireEvent.change(emailInput, { target: { value: formData.email } });

    // Act
    await act(async () => fireEvent.click(submitBtn));

    // Assert
    expect(mockSignup).toHaveBeenCalledOnce();
    expect(mockSignup).toHaveBeenCalledWith(formData);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays an error message if there is an issue signing up.', async () => {
    // Arrange
    const errorMessage = 'error';
    mockSignup.mockRejectedValue([errorMessage]);

    const { getByLabelText, getByText } = render(
      <SignUp signup={mockSignup} />
    );

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const firstNameInput = getByLabelText('First Name');
    const lastNameInput = getByLabelText('Last Name');
    const emailInput = getByLabelText('Email');
    const submitBtn = getByText('Submit');

    fireEvent.change(usernameInput, { target: { value: formData.username } });
    fireEvent.change(passwordInput, { target: { value: formData.password } });
    fireEvent.change(firstNameInput, { target: { value: formData.firstName } });
    fireEvent.change(lastNameInput, { target: { value: formData.lastName } });
    fireEvent.change(emailInput, { target: { value: formData.email } });

    // Act
    await act(async () => fireEvent.click(submitBtn));

    // Assert
    expect(getByText(errorMessage)).toBeVisible();

    expect(mockSignup).toHaveBeenCalledOnce();
    expect(mockSignup).toHaveBeenCalledWith(formData);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
