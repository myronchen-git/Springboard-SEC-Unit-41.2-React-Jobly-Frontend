import PropTypes from 'prop-types';
import { useContext } from 'react';

import { UserContext } from '../contexts.jsx';

// ==================================================

/**
 * Displays some info about a job.  Also allows applying to job.
 *
 * @param {Object} props - React component properties.
 * @param {Object} props.job - The job to display.
 * @param {Object} props.job.id - ID of the job.
 * @param {Object} props.job.title - Title of the job.
 * @param {Object} props.job.salary - Salary of the job.
 * @param {Object} props.job.equity - Equity of the job.
 * @param {Object} props.job.companyName - Name of the company that the job
 *   belongs to.
 * @param {Object} props.isApplied - Whether the user has already applied to the
 *   provided job.
 */
function JobCard({ job, isApplied }) {
  const { applyToJob } = useContext(UserContext);

  return (
    <article className="JobCard">
      <header className="JobCard__header">
        <h1>{job.title}</h1>
        {job.companyName && <p>{job.companyName}</p>}
      </header>
      <summary className="JobCard__info">
        <p>Salary: {job.salary}</p>
        <p>Equity: {job.equity}</p>
      </summary>
      <form className="JobCard__form">
        {isApplied ? (
          <button type="button" disabled>
            Applied
          </button>
        ) : (
          <button type="button" onClick={() => applyToJob(job.id)}>
            Apply
          </button>
        )}
      </form>
    </article>
  );
}

// ==================================================

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
  isApplied: PropTypes.bool.isRequired,
};

export default JobCard;
