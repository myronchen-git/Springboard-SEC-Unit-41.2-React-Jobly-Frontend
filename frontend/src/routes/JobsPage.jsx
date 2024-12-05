import { useEffect, useState } from 'react';

import JoblyApi from '../../../api';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';

// ==================================================

/**
 * Lists all jobs.  Allows the list to be filtered.
 */
function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

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
              <JobCard job={job} isApplied={false} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

// ==================================================

export default JobsPage;
