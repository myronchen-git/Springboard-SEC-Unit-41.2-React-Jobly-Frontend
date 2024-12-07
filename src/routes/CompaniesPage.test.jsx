import { act, fireEvent, render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { companies } from '../_testCommon.js';
import JoblyApi from '../api.js';
import CompaniesPage from './CompaniesPage.jsx';

// ==================================================

vi.mock(import('../api.js'), () => {
  const MockJoblyApi = vi.fn();
  MockJoblyApi.getCompanies = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

vi.mock('react-router-dom');

// ==================================================

describe('CompaniesPage', () => {
  const mockNavigate = vi.fn();
  useNavigate.mockReturnValue(mockNavigate);

  beforeEach(() => {
    JoblyApi.getCompanies.mockImplementation((filters) => {
      let companiesToReturn;

      if (Object.keys(filters).length) {
        // If there are filters.

        const companyName = filters.name;

        companiesToReturn = companies.reduce((arr, company) => {
          if (company.name.toLowerCase().includes(companyName.toLowerCase())) {
            arr.push({ ...company });
          }

          return arr;
        }, []);
      } else {
        // If there are no filters.

        companiesToReturn = structuredClone(companies);
      }

      return Promise.resolve(companiesToReturn);
    });

    mockNavigate.mockReset();
  });

  it('renders.', async () => {
    await act(async () => render(<CompaniesPage />));
  });

  it('matches snapshot.', async () => {
    const { asFragment } = await act(async () => render(<CompaniesPage />));
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays companies and search bar.', async () => {
    // Act
    const { getByPlaceholderText, getByText } = await act(async () =>
      render(<CompaniesPage />)
    );

    // Assert
    companies.forEach((company) => {
      expect(getByText(company.name)).toBeVisible();
    });
    expect(getByPlaceholderText('Enter search term...')).toBeVisible();
  });

  it('filters the list of companies.', async () => {
    // Arrange
    const { getByPlaceholderText, getByText, queryByText } = await act(
      async () => render(<CompaniesPage />)
    );

    const searchInput = getByPlaceholderText('Enter search term...');
    const submitBtn = getByText('Submit');

    // Act
    fireEvent.change(searchInput, { target: { value: companies[0].name } });
    await act(async () => fireEvent.click(submitBtn));

    // Assert
    expect(getByText(companies[0].description)).toBeVisible();

    companies.forEach((company, i) => {
      if (i !== 0) {
        expect(queryByText(company.name)).not.toBeInTheDocument();
      }
    });
  });

  it("navigates to a specific company's page.", async () => {
    // Arrange
    const { getByText } = await act(async () => render(<CompaniesPage />));

    const companyToVisit = getByText(companies[0].name);

    // Act
    fireEvent.click(companyToVisit);

    // Assert
    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith(
      `/companies/${companies[0].handle}`
    );
  });
});
