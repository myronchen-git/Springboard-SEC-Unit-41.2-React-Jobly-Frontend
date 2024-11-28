import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import JoblyApi from '../../../api';

// ==================================================

/**
 * Displays detailed info about a company and a list of its job openings.
 *
 * @param {Object} props - React component properties.
 * @param {Array} props.applications - A list of job IDs that were applied to.
 */
function CompanyPage({ applications }) {
  const { handle } = useParams();
  const [company, setCompany] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    JoblyApi.getCompany(handle).then((companyData) => {
      setJobs([...companyData.jobs]);
      delete companyData.jobs;
      setCompany(companyData);
    });
  }, [handle]);

  return (
    <main className="CompanyPage">
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
            <p>{job.title}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

// ==================================================

CompanyPage.propTypes = {
  applications: PropTypes.array.isRequired,
};

export default CompanyPage;
