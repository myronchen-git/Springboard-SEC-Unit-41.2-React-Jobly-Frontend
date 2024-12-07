import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import HomePage from './HomePage.jsx';

// ==================================================

describe('CompanyPage', () => {
  const username = 'testuser';

  it('renders.', () => {
    render(
      <MemoryRouter>
        <HomePage username={username} />
      </MemoryRouter>
    );
  });

  it('matches snapshot.', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <HomePage username={username} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays correct text when logged in.', () => {
    // Act
    const { queryByText, getByText } = render(
      <MemoryRouter>
        <HomePage username={username} />
      </MemoryRouter>
    );

    // Assert
    expect(getByText('Welcome Back', { exact: false })).toBeVisible();
    expect(queryByText('Log In')).not.toBeInTheDocument();
    expect(queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('displays correct text when not logged in.', () => {
    const username = undefined;

    // Act
    const { queryByText, getByText } = render(
      <MemoryRouter>
        <HomePage username={username} />
      </MemoryRouter>
    );

    // Assert
    expect(
      queryByText('Welcome Back', { exact: false })
    ).not.toBeInTheDocument();
    expect(getByText('Log In')).toBeVisible();
    expect(getByText('Sign Up')).toBeVisible();
  });
});
