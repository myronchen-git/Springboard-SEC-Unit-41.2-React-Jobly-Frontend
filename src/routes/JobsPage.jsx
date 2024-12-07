import { useContext, useEffect, useState } from 'react';

import JoblyApi from '../api.js';
import JobCard from '../components/JobCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { UserContext } from '../contexts.jsx';

// ==================================================

/**
 * Lists all jobs.  Allows the list to be filtered.
 */
function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const { applications } = useContext(UserContext);

  useEffect(() => {
    retrieveJobs();
  }, []);

  async function retrieveJobs(filters = {}) {
    try {
      setJobs(await JoblyApi.getJobs(filters));
    } catch (err) {
      setErrorMessage(err[0]);
    }
  }

  return (
    <main className="JobsPage">
      <SearchBar retrieveItems={retrieveJobs} filterName="title" />
      {errorMessage ? (
        <div className="JobsPage__error">
          <p>{errorMessage}</p>
        </div>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} isApplied={applications.includes(job.id)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

// ==================================================

export default JobsPage;
