import { act, fireEvent, render } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { companyDetails } from '../_testCommon.js';
import JoblyApi from '../api.js';
import { UserContext } from '../contexts.jsx';
import CompanyPage from './CompanyPage.jsx';

// ==================================================

vi.mock('react-router-dom');

vi.mock(import('../api.js'), () => {
  const MockJoblyApi = vi.fn();
  MockJoblyApi.getCompany = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

// ==================================================

describe('CompanyPage', () => {
  const applications = Object.freeze(['2', '3']);
  const mockApplyToJob = vi.fn();

  beforeEach(() => {
    mockApplyToJob.mockReset();

    useParams.mockReturnValue({ handle: companyDetails.handle });
    JoblyApi.getCompany.mockResolvedValue(structuredClone(companyDetails));
  });

  it('renders.', async () => {
    await act(async () =>
      render(
        <UserContext.Provider
          value={{ applications, applyToJob: mockApplyToJob }}
        >
          <CompanyPage />
        </UserContext.Provider>
      )
    );
  });

  it('matches snapshot.', async () => {
    const { asFragment } = await act(async () =>
      render(
        <UserContext.Provider
          value={{ applications, applyToJob: mockApplyToJob }}
        >
          <CompanyPage />
        </UserContext.Provider>
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays data about company.', async () => {
    // Act
    const { getByAltText, getByText } = await act(async () =>
      render(
        <UserContext.Provider
          value={{ applications, applyToJob: mockApplyToJob }}
        >
          <CompanyPage />
        </UserContext.Provider>
      )
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

  it('displays the correct apply button status.', async () => {
    // Act
    const { getAllByText } = await act(async () =>
      render(
        <UserContext.Provider
          value={{ applications, applyToJob: mockApplyToJob }}
        >
          <CompanyPage />
        </UserContext.Provider>
      )
    );

    // Assert
    // Fragile!
    const applybtns = getAllByText('Appl', { exact: false });

    expect(applybtns[0]).toHaveTextContent('Apply');
    expect(applybtns[1]).toHaveTextContent('Applied');
  });

  it('allows applying to a job.', async () => {
    // Arrange
    const { queryAllByText } = await act(async () =>
      render(
        <UserContext.Provider
          value={{ applications, applyToJob: mockApplyToJob }}
        >
          <CompanyPage />
        </UserContext.Provider>
      )
    );

    const applyBtns = queryAllByText('Apply');

    // Act
    await act(async () => fireEvent.click(applyBtns[0]));

    // Assert
    expect(mockApplyToJob).toHaveBeenCalledOnce();
    expect(mockApplyToJob).toHaveBeenCalledWith(companyDetails.jobs[0].id);
  });
});
