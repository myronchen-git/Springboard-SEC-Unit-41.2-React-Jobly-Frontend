import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, List } from 'reactstrap';

import JoblyApi from '../api.js';
import JobCard from '../components/JobCard.jsx';
import { UserContext } from '../contexts.jsx';

import './CompanyPage.css';

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
        <Alert color="danger">{errorMessage}</Alert>
      ) : (
        <>
          <section className="CompanyPage__info">
            <header>
              <div className="CompanyPage__logo-container">
                <img
                  className="CompanyPage__logo"
                  src={company?.logoUrl}
                  alt={`${company.name} Logo`}
                />
              </div>
              <h1>{company.name}</h1>
            </header>
            {company.numEmployees && <p>{company.numEmployees} employees</p>}
            <p>{company.description}</p>
          </section>
          <List className="CompanyPage__jobs" type="unstyled">
            {jobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} isApplied={applications.includes(job.id)} />
              </li>
            ))}
          </List>
        </>
      )}
    </main>
  );
}

// ==================================================

export default CompanyPage;
