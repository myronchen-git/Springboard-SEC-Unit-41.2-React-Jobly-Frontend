import { useContext, useEffect, useState } from 'react';
import { Alert, List } from 'reactstrap';

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
        <Alert color="danger">{errorMessage}</Alert>
      ) : (
        <List className="JobsPage__companies-list" type="unstyled">
          {jobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} isApplied={applications.includes(job.id)} />
            </li>
          ))}
        </List>
      )}
    </main>
  );
}

// ==================================================

export default JobsPage;
