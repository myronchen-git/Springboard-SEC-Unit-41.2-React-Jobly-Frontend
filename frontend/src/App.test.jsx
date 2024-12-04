import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import JoblyApi from '../../api';
import App from './App.jsx';

import {
  authToken,
  companies,
  companyDetails,
  jobs,
  userData,
  userInfo,
} from './_testCommon.js';

// ==================================================

vi.mock(import('../../api'), () => {
  const MockJoblyApi = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

// ==================================================

describe('App', () => {
  it('renders', async () => {
    await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );
  });

  it('matches snapshot.', async () => {
    const { asFragment } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('loads correct homepage when not previously logged in.', async () => {
    // Act
    const { getByText, queryAllByText } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    // Assert
    expect(getByText('All the jobs in one, convenient place.')).toBeVisible();
    expect(queryAllByText('Log In').length).toBeGreaterThanOrEqual(1);
    expect(queryAllByText('Sign Up').length).toBeGreaterThanOrEqual(1);
  });

  it.todo('loads correct homepage when previously logged in.');

  it('allows a user to sign up.', async () => {
    // Arrange
    JoblyApi.registerUser = vi.fn(() => Promise.resolve(authToken));
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));

    const user = userEvent.setup();

    const { findByText, getAllByText, getByLabelText, getByText } = await act(
      async () =>
        render(
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        )
    );

    const signUpBtns = getAllByText('Sign Up');
    await user.click(signUpBtns[0]);

    // Act
    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const firstNameInput = getByLabelText('First Name');
    const lastNameInput = getByLabelText('Last Name');
    const emailInput = getByLabelText('Email');
    const submitBtn = getByText('Submit');

    await user.type(usernameInput, userInfo.username);
    await user.type(passwordInput, userInfo.password);
    await user.type(firstNameInput, userInfo.firstName);
    await user.type(lastNameInput, userInfo.lastName);
    await user.type(emailInput, userInfo.email);

    // Assert
    expect(usernameInput).toHaveValue(userInfo.username);
    expect(passwordInput).toHaveValue(userInfo.password);
    expect(firstNameInput).toHaveValue(userInfo.firstName);
    expect(lastNameInput).toHaveValue(userInfo.lastName);
    expect(emailInput).toHaveValue(userInfo.email);

    // Act
    await user.click(submitBtn);

    // Assert
    expect(await findByText('Welcome Back', { exact: false })).toBeVisible();
  });

  it('allows a user to log in and out.', async () => {
    // Arrange
    JoblyApi.loginUser = vi.fn(() => Promise.resolve(authToken));
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));

    const user = userEvent.setup();

    const { findByText, getAllByText, getByLabelText, getByText } = await act(
      async () =>
        render(
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        )
    );

    const logInBtns = getAllByText('Log In');
    await user.click(logInBtns[0]);

    // Act
    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const submitBtn = getByText('Submit');

    await user.type(usernameInput, userInfo.username);
    await user.type(passwordInput, userInfo.password);

    // Assert
    expect(usernameInput).toHaveValue(userInfo.username);
    expect(passwordInput).toHaveValue(userInfo.password);

    // Act
    await user.click(submitBtn);

    // Assert
    expect(await findByText('Welcome Back', { exact: false })).toBeVisible();

    // Act
    const logoutBtn = getByText('Logout', { exact: false });
    await user.click(logoutBtn);

    // Assert
    expect(await findByText('Log In', { exact: false })).toBeVisible();
  });

  it('allows filtering companies.', async () => {
    // Arrange
    const companyIndexToFilter = 1;

    JoblyApi.loginUser = vi.fn(() => Promise.resolve(authToken));
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));
    JoblyApi.getCompanies = vi.fn((filters) => {
      if (filters.name) {
        return Promise.resolve(
          companies.filter((company) =>
            company.name.toLowerCase().includes(filters.name.toLowerCase())
          )
        );
      } else {
        return Promise.resolve(companies);
      }
    });

    const user = userEvent.setup();

    const {
      findByText,
      getAllByText,
      getByLabelText,
      getByPlaceholderText,
      getByText,
      queryByText,
    } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    await user.click(getAllByText('Log In')[0]);

    await user.type(getByLabelText('Username'), userInfo.username);
    await user.type(getByLabelText('Password'), userInfo.password);
    await user.click(getByText('Submit'));

    await user.click(await findByText('Companies'));

    for (const company of companies) {
      expect(await findByText(company.name)).toBeVisible();
    }

    // Act
    const searchInput = getByPlaceholderText('Enter search term...');
    const submitBtn = getByText('Submit');

    await user.type(searchInput, companies[companyIndexToFilter].name);
    await user.click(submitBtn);

    // Assert
    expect(
      await findByText(companies[companyIndexToFilter].name)
    ).toBeVisible();

    for (let i = 0; i < companies.length; i++) {
      if (i !== companyIndexToFilter) {
        expect(queryByText(companies[i].name)).not.toBeInTheDocument();
      }
    }
  });

  it('displays a specific company and its job openings.', async () => {
    // Arrange
    JoblyApi.loginUser = vi.fn(() => Promise.resolve(authToken));
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));
    JoblyApi.getCompanies = vi.fn(() => Promise.resolve(companies));
    JoblyApi.getCompany = vi.fn(() =>
      Promise.resolve(structuredClone(companyDetails))
    );

    const user = userEvent.setup();

    const { findByText, getAllByText, getByLabelText, getByText } = await act(
      async () =>
        render(
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        )
    );

    await user.click(getAllByText('Log In')[0]);

    await user.type(getByLabelText('Username'), userInfo.username);
    await user.type(getByLabelText('Password'), userInfo.password);
    await user.click(getByText('Submit'));

    // Act
    await user.click(await findByText('Companies'));

    await user.click(await findByText(companies[0].name));

    // Assert
    expect(await findByText(companyDetails.name)).toBeVisible();

    for (const job of companyDetails.jobs) {
      expect(await findByText(job.title)).toBeVisible();
    }
  });

  it.todo("allows a user to apply for a job from a company's job openings.");

  it('allows filtering job openings.', async () => {
    // Arrange
    const jobIndexToFilter = 1;

    JoblyApi.loginUser = vi.fn(() => Promise.resolve(authToken));
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));
    JoblyApi.getJobs = vi.fn((filters) => {
      if (filters.title) {
        return Promise.resolve(
          jobs.filter((job) =>
            job.title.toLowerCase().includes(filters.title.toLowerCase())
          )
        );
      } else {
        return Promise.resolve(jobs);
      }
    });

    const user = userEvent.setup();

    const {
      findByText,
      getAllByText,
      getByLabelText,
      getByPlaceholderText,
      getByText,
      queryByText,
    } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    await user.click(getAllByText('Log In')[0]);

    await user.type(getByLabelText('Username'), userInfo.username);
    await user.type(getByLabelText('Password'), userInfo.password);
    await user.click(getByText('Submit'));

    await user.click(await findByText('Jobs'));

    for (const job of jobs) {
      expect(await findByText(job.title)).toBeVisible();
    }

    // Act
    const searchInput = getByPlaceholderText('Enter search term...');
    const submitBtn = getByText('Submit');

    await user.type(searchInput, jobs[jobIndexToFilter].title);
    await user.click(submitBtn);

    // Assert
    expect(await findByText(jobs[jobIndexToFilter].title)).toBeVisible();

    for (let i = 0; i < jobs.length; i++) {
      if (i !== jobIndexToFilter) {
        expect(queryByText(jobs[i].title)).not.toBeInTheDocument();
      }
    }
  });

  it.todo(
    'allows a user to apply for a job from the list of all job openings.'
  );

  it.todo("allows updating the user's profile.");
});
