import { useEffect, useState } from 'react';
import { Alert, List } from 'reactstrap';

import JoblyApi from '../api.js';
import CompanyCard from '../components/CompanyCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

// ==================================================

/**
 * Lists all companies.  Allows the list to be filtered.
 */
function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    retrieveCompanies();
  }, []);

  async function retrieveCompanies(filters = {}) {
    try {
      const companies = await JoblyApi.getCompanies(filters);
      setCompanies(companies);
    } catch (err) {
      setErrorMessage(err[0]);
    }
  }

  return (
    <main className="CompaniesPage">
      <SearchBar retrieveItems={retrieveCompanies} filterName="name" />
      {errorMessage ? (
        <Alert color="danger">{errorMessage}</Alert>
      ) : (
        <List className="CompaniesPage__companies-list" type="unstyled">
          {companies.map((company) => (
            <li key={company.handle}>
              <CompanyCard company={company} />
            </li>
          ))}
        </List>
      )}
    </main>
  );
}

// ==================================================

export default CompaniesPage;
