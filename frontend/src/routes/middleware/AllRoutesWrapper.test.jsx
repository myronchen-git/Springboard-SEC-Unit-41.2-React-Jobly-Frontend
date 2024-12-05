import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from '../../contexts';
import AllRoutesWrapper from './AllRoutesWrapper.jsx';

// ==================================================

describe('AllRoutesWrapper', () => {
  it('renders', () => {
    // Arrange
    const url = '/';
    const user = {};

    // Act
    _renderHelper(url, user);
  });

  it('matches snapshot.', () => {
    // Arrange
    const url = '/';
    const user = {};

    // Act
    const { asFragment } = _renderHelper(url, user);

    // Assert
    expect(asFragment()).toMatchSnapshot();
  });

  it.each([['/companies'], ['/jobs'], ['/profile'], ['/companies/abc']])(
    'disallows access to "%s" if not logged in.',
    (url) => {
      // Arrange
      const user = {};

      // Act
      const { getByText } = _renderHelper(url, user);

      // Assert
      expect(getByText('home')).toBeInTheDocument();
    }
  );

  it.each([['/signup'], ['/login']])(
    'allows access to "%s" if not logged in.',
    (url) => {
      // Arrange
      const user = {};

      // Act
      const { getByText } = _renderHelper(url, user);

      // Assert
      expect(getByText('other route')).toBeInTheDocument();
    }
  );

  it.each([['/signup'], ['/login']])(
    'disallows access to "%s" if logged in.',
    (url) => {
      // Arrange
      const user = { username: 'name' };

      // Act
      const { getByText } = _renderHelper(url, user);

      // Assert
      expect(getByText('home')).toBeInTheDocument();
    }
  );

  it.each([['/companies'], ['/jobs'], ['/profile'], ['/companies/abc']])(
    'allows access to "%s" if logged in.',
    (url) => {
      // Arrange
      const user = { username: 'name' };

      // Act
      const { getByText } = _renderHelper(url, user);

      // Assert
      expect(getByText('other route')).toBeInTheDocument();
    }
  );
});

// ==================================================

/**
 * Helps render the React component that is being tested, in order to reduce
 * repeated code.
 *
 * @param {String} url - The URL to test visiting at.
 * @param {Object} user - User Object that is being passed down thru
 *   UserContext.  This is the one being stored in App.  This can be
 * @param {String} user.username - Username of test user, if user is logged in.
 * @returns {Object} render output.
 */
function _renderHelper(url, user) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <UserContext.Provider value={{ user }}>
        <Routes>
          <Route element={<AllRoutesWrapper />}>
            <Route path="/" element={<p>home</p>} />
            <Route path="*" element={<p>other route</p>} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </MemoryRouter>
  );
}
