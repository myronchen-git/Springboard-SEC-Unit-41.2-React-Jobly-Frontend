import { useEffect, useState } from 'react';

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
        <div className="CompaniesPage__error">
          <p>{errorMessage}</p>
        </div>
      ) : (
        <ul>
          {companies.map((company) => (
            <li key={company.handle}>
              <CompanyCard company={company} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

// ==================================================

export default CompaniesPage;
