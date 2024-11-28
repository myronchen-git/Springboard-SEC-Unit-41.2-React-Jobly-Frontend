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

  useEffect(() => {
    retrieveJobs();
  }, []);

  async function retrieveJobs(filters = {}) {
    setJobs(await JoblyApi.getJobs(filters));
  }

  return (
    <main className="JobsPage">
      <SearchBar retrieveItems={retrieveJobs} filterName="title" />
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <JobCard job={job} isApplied={false} />
          </li>
        ))}
      </ul>
    </main>
  );
}

// ==================================================

export default JobsPage;
