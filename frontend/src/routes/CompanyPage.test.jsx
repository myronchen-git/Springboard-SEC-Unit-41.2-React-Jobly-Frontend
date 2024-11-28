import { act, render } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import JoblyApi from '../../../api';
import { companyDetails } from '../_testCommon.js';
import CompanyPage from './CompanyPage.jsx';

// ==================================================

vi.mock('react-router-dom');

vi.mock(import('../../../api'), () => {
  const MockJoblyApi = vi.fn();
  MockJoblyApi.getCompany = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

// ==================================================

describe('CompanyPage', () => {
  const applications = Object.freeze([2, 3]);

  beforeEach(() => {
    useParams.mockReturnValue({ handle: companyDetails.handle });
    JoblyApi.getCompany.mockResolvedValue(structuredClone(companyDetails));
  });

  it('renders.', async () => {
    await act(async () => render(<CompanyPage applications={applications} />));
  });

  it('matches snapshot.', async () => {
    const { asFragment } = await act(async () =>
      render(<CompanyPage applications={applications} />)
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays data about company.', async () => {
    // Act
    const { getByAltText, getByText } = await act(async () =>
      render(<CompanyPage applications={applications} />)
    );

    // Assert
    expect(getByAltText(`${companyDetails.name} Logo`)).toBeVisible();
    expect(getByText(companyDetails.name)).toBeVisible();
    expect(getByText(companyDetails.description)).toBeVisible();
    expect(getByText(companyDetails.numEmployees + ' employees')).toBeVisible();

    companyDetails.jobs.forEach((job) => {
      expect(getByText(job.title)).toBeVisible();
    });
  });
});
