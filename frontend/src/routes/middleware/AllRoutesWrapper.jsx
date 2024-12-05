import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { UserContext } from '../../contexts.jsx';

// ==================================================

/**
 * Middleware that is applied before the execution of all routes.
 * Currently only holds route protection.
 */
function AllRoutesWrapper() {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const urlsToAvoid = user.username
    ? ['/signup', '/login'] // If logged in.
    : ['/companies', '/jobs', '/profile']; // If not logged in.

  if (
    urlsToAvoid.some((url) => location.pathname.toLowerCase().startsWith(url))
  ) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
}

// ==================================================

export default AllRoutesWrapper;
