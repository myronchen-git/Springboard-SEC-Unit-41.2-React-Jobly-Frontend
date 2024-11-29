import { act, fireEvent, render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Login from './Login.jsx';

// ==================================================

vi.mock('react-router-dom');

// ==================================================

describe('SignUp', () => {
  const formData = Object.freeze({
    username: 'user1',
    password: '12345',
  });

  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();
  useNavigate.mockReturnValue(mockNavigate);

  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  it('renders.', async () => {
    await act(async () => render(<Login login={mockLogin} />));
  });

  it('matches snapshot.', async () => {
    const { asFragment } = await act(async () =>
      render(<Login login={mockLogin} />)
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('can update form data.', () => {
    // Arrange
    const { getByLabelText } = render(<Login login={mockLogin} />);

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');

    // Act
    fireEvent.change(usernameInput, { target: { value: formData.username } });
    fireEvent.change(passwordInput, { target: { value: formData.password } });

    // Assert
    expect(usernameInput).toHaveValue(formData.username);
    expect(passwordInput).toHaveValue(formData.password);

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('can submit form data.', async () => {
    // Arrange
    const { getByLabelText, getByText } = render(<Login login={mockLogin} />);

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const submitBtn = getByText('Submit');

    fireEvent.change(usernameInput, { target: { value: formData.username } });
    fireEvent.change(passwordInput, { target: { value: formData.password } });

    // Act
    await act(async () => fireEvent.click(submitBtn));

    // Assert
    expect(mockLogin).toHaveBeenCalledOnce();
    expect(mockLogin).toHaveBeenCalledWith(formData);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays an error message if username or password is wrong.', async () => {
    // Arrange
    const errorMessage = 'error';
    mockLogin.mockRejectedValue([errorMessage]);

    const { getByLabelText, getByText } = render(<Login login={mockLogin} />);

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const submitBtn = getByText('Submit');

    fireEvent.change(usernameInput, { target: { value: formData.username } });
    fireEvent.change(passwordInput, { target: { value: formData.password } });

    // Act
    await act(async () => fireEvent.click(submitBtn));

    // Assert
    expect(getByText(errorMessage)).toBeVisible();

    expect(mockLogin).toHaveBeenCalledOnce();
    expect(mockLogin).toHaveBeenCalledWith(formData);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
