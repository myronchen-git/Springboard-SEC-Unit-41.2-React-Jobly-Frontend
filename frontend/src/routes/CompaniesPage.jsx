import { useEffect, useState } from 'react';

import JoblyApi from '../../../api';
import CompanyCard from '../components/CompanyCard';
import SearchBar from '../components/SearchBar';

// ==================================================

/**
 * Lists all companies.  Allows the list to be filtered.
 */
function CompaniesPage() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    retrieveCompanies();
  }, []);

  async function retrieveCompanies(filters = {}) {
    setCompanies(await JoblyApi.getCompanies(filters));
  }

  return (
    <main className="CompaniesPage">
      <SearchBar retrieveItems={retrieveCompanies} filterName="name" />
      <ul>
        {companies.map((company) => (
          <li key={company.handle}>
            <CompanyCard company={company} />
          </li>
        ))}
      </ul>
    </main>
  );
}

// ==================================================

export default CompaniesPage;
