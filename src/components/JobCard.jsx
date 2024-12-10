import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Form,
} from 'reactstrap';

import { UserContext } from '../contexts.jsx';

import './JobCard.css';

// ==================================================

/**
 * Displays some info about a job.  Also allows applying to job.
 *
 * @param {Object} props - React component properties.
 * @param {Object} props.job - The job to display.
 * @param {String} props.job.id - ID of the job.
 * @param {String} props.job.title - Title of the job.
 * @param {Number} props.job.salary - Salary of the job.
 * @param {Number} props.job.equity - Equity of the job.
 * @param {String} props.job.companyName - Name of the company that the job
 *   belongs to.
 * @param {Boolean} props.isApplied - Whether the user has already applied to the
 *   provided job.
 */
function JobCard({ job, isApplied }) {
  const { applyToJob } = useContext(UserContext);

  return (
    <Card className="JobCard">
      <CardBody className="JobCard__info">
        <CardTitle tag="h4">{job.title}</CardTitle>
        {job.companyName && <CardSubtitle>{job.companyName}</CardSubtitle>}
        <CardText>
          Salary:{' '}
          {job.salary &&
            job.salary.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            })}
        </CardText>
        <CardText>Equity: {job.equity}</CardText>
      </CardBody>
      <Form className="JobCard__form">
        {isApplied ? (
          <Button disabled>Applied</Button>
        ) : (
          <Button onClick={() => applyToJob(job.id)}>Apply</Button>
        )}
      </Form>
    </Card>
  );
}

// ==================================================

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
  isApplied: PropTypes.bool.isRequired,
};

export default JobCard;
