import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NavBar from './NavBar';

// ==================================================

describe('NavBar', () => {
  const username = 'testuser';
  const mockLogout = vi.fn();

  beforeEach(() => {
    mockLogout.mockReset();
  });

  it('renders', () => {
    render(
      <MemoryRouter>
        <NavBar username={username} logout={mockLogout} />
      </MemoryRouter>
    );
  });

  it('matches snapshot.', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <NavBar username={username} logout={mockLogout} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays correct links when logged in.', () => {
    // Act
    const { queryByText, getByText } = render(
      <MemoryRouter>
        <NavBar username={username} logout={mockLogout} />
      </MemoryRouter>
    );

    // Assert
    expect(getByText('Home')).toBeVisible();
    expect(getByText('Companies')).toBeVisible();
    expect(getByText('Jobs')).toBeVisible();
    expect(getByText('Profile')).toBeVisible();
    expect(getByText(`Logout ${username}`)).toBeVisible();
    expect(queryByText('Login')).not.toBeInTheDocument();
    expect(queryByText('Sign Up')).not.toBeInTheDocument();

    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('displays correct links when not logged in.', () => {
    // Arrange
    const username = undefined;

    // Act
    const { queryByText, getByText } = render(
      <MemoryRouter>
        <NavBar username={username} logout={mockLogout} />
      </MemoryRouter>
    );

    // Assert
    expect(getByText('Home')).toBeVisible();
    expect(queryByText('Companies')).not.toBeInTheDocument();
    expect(queryByText('Jobs')).not.toBeInTheDocument();
    expect(queryByText('Profile')).not.toBeInTheDocument();
    expect(queryByText(`Logout`, { exact: false })).not.toBeInTheDocument();
    expect(getByText('Login')).toBeVisible();
    expect(getByText('Sign Up')).toBeVisible();

    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('logs out a user.', () => {
    // Arrange
    const { getByText } = render(
      <MemoryRouter>
        <NavBar username={username} logout={mockLogout} />
      </MemoryRouter>
    );

    // Act
    const logoutBtn = getByText('Logout', { exact: false });
    fireEvent.click(logoutBtn);

    // Assert
    expect(mockLogout).toHaveBeenCalledOnce();
  });
});
