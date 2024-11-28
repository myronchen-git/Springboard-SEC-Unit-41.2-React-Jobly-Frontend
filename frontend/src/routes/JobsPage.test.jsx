import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import JoblyApi from '../../../api';
import { jobs } from '../_testCommon.js';
import JobsPage from './JobsPage.jsx';

// ==================================================

vi.mock(import('../../../api'), () => {
  const MockJoblyApi = vi.fn();
  MockJoblyApi.getJobs = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

vi.mock('react-router-dom');

// ==================================================

describe('JobsPage', () => {
  beforeEach(() => {
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
    await act(async () => render(<JobsPage />));
  });

  it('matches snapshot.', async () => {
    const { asFragment } = await act(async () => render(<JobsPage />));
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays jobs and search bar.', async () => {
    // Act
    const { getByPlaceholderText, getByText } = await act(async () =>
      render(<JobsPage />)
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
      async () => render(<JobsPage />)
    );

    const searchInput = getByPlaceholderText('Enter search term...');
    const submitBtn = getByText('Submit');

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
});
