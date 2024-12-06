import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useMemo, useState } from 'react';

import JoblyApi from '../../api.js';
import NavBar from './components/NavBar';
import { UserContext } from './contexts.jsx';
import RoutesList from './RoutesList';
import { useLocalStorage } from './util/hooks.jsx';

import './App.css';

// ==================================================

/**
 * The core app component for Jobly.  This contains shared data and functions.
 */
function App() {
  const [authToken, setAuthToken] = useLocalStorage('authToken', null);
  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const runEffect = async () => {
      if (authToken) {
        let user;
        try {
          const { username } = jwtDecode(authToken);
          JoblyApi.token = authToken;
          user = await JoblyApi.getUser(username);
        } catch (err) {
          if (Array.isArray(err)) {
            console.error(err[0]);
          } else {
            console.error(err.message);
          }
          return;
        }

        setApplications([...user.applications]);
        delete user.applications;
        setUser(user);
      } else {
        setUser({});
        setApplications([]);
      }
    };
    runEffect();
  }, [authToken]);

  const signup = useCallback(async (formData) => {
    const authToken = await JoblyApi.registerUser(formData);
    setAuthToken(authToken);
  }, []);

  const login = useCallback(async (formData) => {
    const authToken = await JoblyApi.loginUser(formData);
    setAuthToken(authToken);
  }, []);

  function logout() {
    setAuthToken(null);
  }

  /**
   * Applies to a specific job.  Calls backend to update database.  Updates
   * applications state.
   * @param {String} jobId - ID of the job to apply to.
   */
  const applyToJob = useCallback(async (jobId) => {
    const appliedJobId = await JoblyApi.postApplication(user.username, jobId);
    setApplications((applications) => [...applications, appliedJobId]);
  });

  const userContextValues = useMemo(
    () => ({
      login,
      signup,
      user,
      setUser,
      applications,
      applyToJob,
    }),
    [login, signup, user, setUser, applications, applyToJob]
  );

  return (
    <UserContext.Provider value={userContextValues}>
      <div className="App">
        <NavBar username={user.username} logout={logout} />
        <RoutesList />
      </div>
    </UserContext.Provider>
  );
}

// ==================================================

export default App;
