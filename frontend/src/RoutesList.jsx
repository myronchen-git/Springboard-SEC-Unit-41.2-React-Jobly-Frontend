import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { UserContext } from './contexts.jsx';
import CompaniesPage from './routes/CompaniesPage.jsx';
import CompanyPage from './routes/CompanyPage.jsx';
import HomePage from './routes/HomePage.jsx';
import JobsPage from './routes/JobsPage.jsx';
import Login from './routes/Login.jsx';
import NotFound from './routes/NotFound.jsx';
import Profile from './routes/Profile.jsx';
import SignUp from './routes/SignUp.jsx';
import AllRoutesWrapper from './routes/middleware/AllRoutesWrapper.jsx';

// ==================================================

function RoutesList() {
  const { applications, login, signup, user } = useContext(UserContext);

  return (
    <Routes>
      <Route element={<AllRoutesWrapper />}>
        <Route path="/" element={<HomePage username={user.username} />} />
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/signup" element={<SignUp signup={signup} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/companies">
          <Route index element={<CompaniesPage />} />
          <Route
            path=":handle"
            element={<CompanyPage applications={applications} />}
          />
          <Route path="*" element={<NotFound resourceName="Company " />} />
        </Route>
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

// ==================================================

export default RoutesList;
