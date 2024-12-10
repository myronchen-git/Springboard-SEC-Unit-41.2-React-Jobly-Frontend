import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import './CompanyCard.css';

// ==================================================

/**
 * Displays some info about a company.
 *
 * @param {Object} props - React component properties.
 * @param {Object} props.company - The company to display.
 * @param {String} props.company.name - Name of the company.
 * @param {String} props.company.description - Description of the company.
 * @param {Object} props.company.numEmployees - Number of employees in the
 *   company.
 * @param {Object} props.company.logoUrl - URL of the logo.
 */
function CompanyCard({ company }) {
  const navigate = useNavigate();

  return (
    <Card
      className="CompanyCard"
      onClick={() => navigate(`/companies/${company.handle}`)}
    >
      <img
        className="CompanyCard__logo"
        src={company?.logoUrl}
        alt={`${company.name} Logo`}
      />
      <CardBody className="CompanyCard__info">
        <CardTitle tag="h3">{company.name}</CardTitle>
        {company.numEmployees && (
          <CardSubtitle>{company.numEmployees} employees</CardSubtitle>
        )}
        <CardText>{company.description}</CardText>
      </CardBody>
    </Card>
  );
}

// ==================================================

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired,
};

export default CompanyCard;
