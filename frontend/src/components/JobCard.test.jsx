import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { jobs } from '../_testCommon.js';
import JobCard from './JobCard.jsx';

// ==================================================

vi.mock('react-router-dom');

// ==================================================

describe('JobCard', () => {
  const originalJob = jobs[0];
  let job;

  beforeEach(() => {
    job = structuredClone(jobs[0]);
  });

  it('renders.', () => {
    render(<JobCard job={job} isApplied={false} />);
  });

  it('matches snapshot.', () => {
    const { asFragment } = render(<JobCard job={job} isApplied={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays job info.', () => {
    // Act
    const { getByText } = render(<JobCard job={job} isApplied={false} />);

    // Assert
    expect(getByText(originalJob.title)).toBeVisible();
    expect(getByText('Salary: ' + originalJob.salary)).toBeVisible();
    expect(getByText('Equity: ' + originalJob.equity)).toBeVisible();
    expect(getByText(originalJob.companyName)).toBeVisible();
  });

  it('displays job info without salary.', () => {
    // Arrange
    delete job.salary;

    // Act
    const { getByText, queryByText } = render(
      <JobCard job={job} isApplied={false} />
    );

    // Assert
    expect(getByText(originalJob.title)).toBeVisible();
    expect(
      queryByText('Salary: ' + originalJob.salary)
    ).not.toBeInTheDocument();
    expect(getByText('Equity: ' + originalJob.equity)).toBeVisible();
    expect(getByText(originalJob.companyName)).toBeVisible();
  });

  it('displays job info without equity.', () => {
    // Arrange
    delete job.equity;

    // Act
    const { getByText, queryByText } = render(
      <JobCard job={job} isApplied={false} />
    );

    // Assert
    expect(getByText(originalJob.title)).toBeVisible();
    expect(getByText('Salary: ' + originalJob.salary)).toBeVisible();
    expect(
      queryByText('Equity: ' + originalJob.equity)
    ).not.toBeInTheDocument();
    expect(getByText(originalJob.companyName)).toBeVisible();
  });

  it.each([
    [false, 'Apply'],
    [true, 'Applied'],
  ])(
    'displays Apply button correctly when isApplied is %s.',
    (isApplied, expectedApplyBtnText) => {
      // Act
      const { getByText } = render(<JobCard job={job} isApplied={isApplied} />);

      // Assert
      const applyBtn = getByText(expectedApplyBtnText);

      expect(applyBtn).toBeVisible();

      isApplied
        ? expect(applyBtn).toBeDisabled()
        : expect(applyBtn).toBeEnabled();
    }
  );
});
