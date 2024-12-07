import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

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
    <article
      className="CompanyCard"
      onClick={() => navigate(`/companies/${company.handle}`)}
    >
      <header className="CompanyCard__header">
        <img src={company?.logoUrl} alt={`${company.name} Logo`} />
        <h1>{company.name}</h1>
      </header>
      <summary className="CompanyCard__info">
        {company.numEmployees && <p>{company.numEmployees} employees</p>}
        <p>{company.description}</p>
      </summary>
    </article>
  );
}

// ==================================================

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired,
};

export default CompanyCard;
