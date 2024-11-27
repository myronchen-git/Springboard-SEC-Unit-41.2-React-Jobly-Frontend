import { Navigate, Route, Routes } from 'react-router-dom';

import HomePage from './routes/HomePage.jsx';
import Login from './routes/Login.jsx';
import SignUp from './routes/SignUp.jsx';
import Profile from './routes/Profile.jsx';
import CompaniesPage from './routes/CompaniesPage.jsx';
import CompanyPage from './routes/CompanyPage.jsx';
import JobsPage from './routes/JobsPage.jsx';
import NotFound from './routes/NotFound.jsx';

// ==================================================

function RoutesList() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/companies">
        <Route index element={<CompaniesPage />} />
        <Route path=":handle" element={<CompanyPage />} />
        <Route path="*" element={<NotFound resourceName="Company " />} />
      </Route>
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// ==================================================

export default RoutesList;
