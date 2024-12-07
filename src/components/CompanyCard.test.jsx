import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

import { companies } from '../_testCommon.js';
import CompanyCard from './CompanyCard.jsx';

// ==================================================

vi.mock('react-router-dom');

// ==================================================

describe('CompanyCard', () => {
  const originalCompany = companies[0];
  let company;

  const mockNavigate = vi.fn();
  useNavigate.mockReturnValue(mockNavigate);

  beforeEach(() => {
    company = structuredClone(companies[0]);

    mockNavigate.mockReset();
  });

  it('renders.', () => {
    render(<CompanyCard company={company} />);
  });

  it('matches snapshot.', () => {
    const { asFragment } = render(<CompanyCard company={company} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays company info.', () => {
    // Act
    const { getByAltText, getByText } = render(
      <CompanyCard company={company} />
    );

    // Assert
    expect(getByAltText(`${originalCompany.name} Logo`)).toBeVisible();
    expect(getByText(originalCompany.name)).toBeVisible();
    expect(getByText(originalCompany.description)).toBeVisible();
    expect(
      getByText(originalCompany.numEmployees + ' employees')
    ).toBeVisible();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays company info without logo.', () => {
    // Arrange
    delete company.logo;

    // Act
    const { getByAltText, getByText } = render(
      <CompanyCard company={company} />
    );

    // Assert
    expect(getByAltText(`${originalCompany.name} Logo`)).toBeVisible();
    expect(getByText(originalCompany.name)).toBeVisible();
    expect(getByText(originalCompany.description)).toBeVisible();
    expect(
      getByText(originalCompany.numEmployees + ' employees')
    ).toBeVisible();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays company info without number of employees.', () => {
    // Arrange
    delete company.numEmployees;

    // Act
    const { getByAltText, getByText, queryByText } = render(
      <CompanyCard company={company} />
    );

    // Assert
    expect(getByAltText(`${originalCompany.name} Logo`)).toBeVisible();
    expect(getByText(originalCompany.name)).toBeVisible();
    expect(getByText(originalCompany.description)).toBeVisible();
    expect(queryByText('employees')).not.toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to the specific company page when clicked.', () => {
    // Arrange
    const { getByText } = render(<CompanyCard company={company} />);

    const companyName = getByText(company.name);

    // Act
    fireEvent.click(companyName);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(
      `/companies/${originalCompany.handle}`
    );
  });
});
