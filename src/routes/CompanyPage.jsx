import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import JoblyApi from '../api.js';
import JobCard from '../components/JobCard.jsx';
import { UserContext } from '../contexts.jsx';

// ==================================================

/**
 * Displays detailed info about a company and a list of its job openings.
 */
function CompanyPage() {
  const { handle } = useParams();
  const [company, setCompany] = useState({});
  const [jobs, setJobs] = useState([]);
  const { applications } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    JoblyApi.getCompany(handle)
      .then((companyData) => {
        setJobs([...companyData.jobs]);
        delete companyData.jobs;
        setCompany(companyData);
      })
      .catch((err) => setErrorMessage(err[0]));
  }, [handle]);

  return (
    <main className="CompanyPage">
      {errorMessage ? (
        <div className="CompanyPage__error">
          <p>{errorMessage}</p>
        </div>
      ) : (
        <>
          <section className="CompanyPage__info">
            <header>
              <img src={company?.logoUrl} alt={`${company.name} Logo`} />
              <h1>{company.name}</h1>
            </header>
            {company.numEmployees && <p>{company.numEmployees} employees</p>}
            <p>{company.description}</p>
          </section>
          <ul className="CompanyPage__jobs">
            {jobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} isApplied={applications.includes(job.id)} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

// ==================================================

export default CompanyPage;
