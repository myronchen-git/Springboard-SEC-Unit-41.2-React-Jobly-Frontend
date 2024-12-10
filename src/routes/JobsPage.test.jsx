import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { jobs } from '../_testCommon.js';
import JoblyApi from '../api.js';
import { UserContext } from '../contexts.jsx';
import JobsPage from './JobsPage.jsx';

// ==================================================

vi.mock(import('../api.js'), () => {
  const MockJoblyApi = vi.fn();
  MockJoblyApi.getJobs = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

// ==================================================

describe('JobsPage', () => {
  const applications = Object.freeze(['2', '3']);
  const mockApplyToJob = vi.fn();

  beforeEach(() => {
    mockApplyToJob.mockReset();

    JoblyApi.getJobs.mockImplementation((filters) => {
      let jobsToReturn;

      if (Object.keys(filters).length) {
        // If there are filters.

        const jobTitle = filters.title;

        jobsToReturn = jobs.reduce((arr, job) => {
          if (job.title.toLowerCase().includes(jobTitle.toLowerCase())) {
            arr.push({ ...job });
          }

          return arr;
        }, []);
      } else {
        // If there are no filters.

        jobsToReturn = structuredClone(jobs);
      }

      return Promise.resolve(jobsToReturn);
    });
  });

  it('renders.', async () => {
    await act(async () =>
      render(
        <UserContext.Provider
          value={{ applications, applyToJob: mockApplyToJob }}
        >
          <JobsPage />
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
          <JobsPage />
        </UserContext.Provider>
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays jobs and search bar.', async () => {
    // Act
    const { getByPlaceholderText, getByText } = await act(async () =>
      render(
        <UserContext.Provider
          value={{ applications, applyToJob: mockApplyToJob }}
        >
          <JobsPage />
        </UserContext.Provider>
      )
    );

    // Assert
    jobs.forEach((job) => {
      expect(getByText(job.title)).toBeVisible();
    });
    expect(getByPlaceholderText('Enter search term...')).toBeVisible();
  });

  it('filters the list of jobs.', async () => {
    // Arrange
    const { getByPlaceholderText, getByText, queryByText } = await act(
      async () =>
        render(
          <UserContext.Provider
            value={{ applications, applyToJob: mockApplyToJob }}
          >
            <JobsPage />
          </UserContext.Provider>
        )
    );

    const searchInput = getByPlaceholderText('Enter search term...');
    const submitBtn = getByText('Search');

    // Act
    fireEvent.change(searchInput, { target: { value: jobs[0].title } });
    await act(async () => fireEvent.click(submitBtn));

    // Assert
    expect(getByText(jobs[0].companyName)).toBeVisible();

    jobs.forEach((job, i) => {
      if (i !== 0) {
        expect(queryByText(job.title)).not.toBeInTheDocument();
      }
    });
  });

  it('displays the correct apply button status.', async () => {
    // Act
    const { getAllByText } = await act(async () =>
      render(
        <UserContext.Provider
          value={{ applications, applyToJob: mockApplyToJob }}
        >
          <JobsPage />
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
          <JobsPage />
        </UserContext.Provider>
      )
    );

    const applyBtns = queryAllByText('Apply');

    // Act
    await act(async () => fireEvent.click(applyBtns[0]));

    // Assert
    expect(mockApplyToJob).toHaveBeenCalledOnce();
    expect(mockApplyToJob).toHaveBeenCalledWith(jobs[0].id);
  });
});
