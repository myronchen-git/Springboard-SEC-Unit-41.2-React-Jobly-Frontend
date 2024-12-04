import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import JoblyApi from '../../api';
import App from './App.jsx';

import { authToken, userData, userInfo } from './_testCommon.js';

// ==================================================

vi.mock(import('../../api'), () => {
  const MockJoblyApi = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

// ==================================================

describe('App', () => {
  it('renders', async () => {
    await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );
  });

  it('matches snapshot.', async () => {
    const { asFragment } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('loads correct homepage when not previously logged in.', async () => {
    // Act
    const { getByText, queryAllByText } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    // Assert
    expect(getByText('All the jobs in one, convenient place.')).toBeVisible();
    expect(queryAllByText('Log In').length).toBeGreaterThanOrEqual(1);
    expect(queryAllByText('Sign Up').length).toBeGreaterThanOrEqual(1);
  });

  it.todo('loads correct homepage when previously logged in.');

  it('allows a user to sign up.', async () => {
    // Arrange
    JoblyApi.registerUser = vi.fn(() => Promise.resolve(authToken));
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));

    const user = userEvent.setup();

    const { findByText, getAllByText, getByLabelText, getByText } = await act(
      async () =>
        render(
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        )
    );

    const signUpBtns = getAllByText('Sign Up');
    await user.click(signUpBtns[0]);

    // Act
    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const firstNameInput = getByLabelText('First Name');
    const lastNameInput = getByLabelText('Last Name');
    const emailInput = getByLabelText('Email');
    const submitBtn = getByText('Submit');

    await user.type(usernameInput, userInfo.username);
    await user.type(passwordInput, userInfo.password);
    await user.type(firstNameInput, userInfo.firstName);
    await user.type(lastNameInput, userInfo.lastName);
    await user.type(emailInput, userInfo.email);

    // Assert
    expect(usernameInput).toHaveValue(userInfo.username);
    expect(passwordInput).toHaveValue(userInfo.password);
    expect(firstNameInput).toHaveValue(userInfo.firstName);
    expect(lastNameInput).toHaveValue(userInfo.lastName);
    expect(emailInput).toHaveValue(userInfo.email);

    // Act
    await user.click(submitBtn);

    // Assert
    expect(await findByText('Welcome Back', { exact: false })).toBeVisible();
  });

  it('allows a user to log in and out.', async () => {
    // Arrange
    JoblyApi.loginUser = vi.fn(() => Promise.resolve(authToken));
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));

    const user = userEvent.setup();

    const { findByText, getAllByText, getByLabelText, getByText } = await act(
      async () =>
        render(
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        )
    );

    const logInBtns = getAllByText('Log In');
    await user.click(logInBtns[0]);

    // Act
    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const submitBtn = getByText('Submit');

    await user.type(usernameInput, userInfo.username);
    await user.type(passwordInput, userInfo.password);

    // Assert
    expect(usernameInput).toHaveValue(userInfo.username);
    expect(passwordInput).toHaveValue(userInfo.password);

    // Act
    await user.click(submitBtn);

    // Assert
    expect(await findByText('Welcome Back', { exact: false })).toBeVisible();

    // Act
    const logoutBtn = getByText('Logout', { exact: false });
    await user.click(logoutBtn);

    // Assert
    expect(await findByText('Log In', { exact: false })).toBeVisible();
  });
});
