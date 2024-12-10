import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import JoblyApi from './api.js';
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

vi.mock(import('./api.js'), () => {
  const MockJoblyApi = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

// ==================================================

describe('App', () => {
  let localStorage = {};

  beforeAll(() => {
    // https://stackoverflow.com/a/65286435
    window.localStorage = {
      getItem: (key) => localStorage[key] || null,
      setItem: (key, value) => (localStorage[key] = value.toString()),
      removeItem: (key) => {
        delete localStorage[key];
      },
    };
  });

  beforeEach(() => {
    localStorage = {};
  });

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

  it('loads correct homepage when previously logged in.', async () => {
    // Arrange
    window.localStorage.setItem('authToken', authToken);
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));

    // Act
    const { getByText, queryByText } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    // Assert
    expect(getByText('Welcome Back', { exact: false })).toBeVisible();
    expect(queryByText('Log In')).not.toBeInTheDocument();
    expect(queryByText('Sign Up')).not.toBeInTheDocument();
  });

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

    window.localStorage.setItem('authToken', authToken);
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

    const { findByText, getByPlaceholderText, getByText, queryByText } =
      await act(async () =>
        render(
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        )
      );

    await user.click(await findByText('Companies'));

    for (const company of companies) {
      expect(await findByText(company.name)).toBeVisible();
    }

    // Act
    const searchInput = getByPlaceholderText('Enter search term...');
    const submitBtn = getByText('Search');

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
    window.localStorage.setItem('authToken', authToken);
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));
    JoblyApi.getCompanies = vi.fn(() => Promise.resolve(companies));
    JoblyApi.getCompany = vi.fn(() =>
      Promise.resolve(structuredClone(companyDetails))
    );

    const user = userEvent.setup();

    const { findByText } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    // Act
    await user.click(await findByText('Companies'));

    await user.click(await findByText(companies[0].name));

    // Assert
    expect(await findByText(companyDetails.name)).toBeVisible();

    for (const job of companyDetails.jobs) {
      expect(await findByText(job.title)).toBeVisible();
    }
  });

  it("allows a user to apply for a job from a company's job openings.", async () => {
    // Arrange
    window.localStorage.setItem('authToken', authToken);
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));
    JoblyApi.getCompanies = vi.fn(() => Promise.resolve(companies));
    JoblyApi.getCompany = vi.fn(() =>
      Promise.resolve(structuredClone(companyDetails))
    );
    JoblyApi.postApplication = vi.fn((username, jobId) =>
      Promise.resolve(jobId)
    );

    const user = userEvent.setup();

    const { findByText, queryAllByText } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    await user.click(await findByText('Companies'));
    await user.click(await findByText(companies[0].name));

    // Act
    await user.click(queryAllByText('Apply')[0]);

    // Assert
    expect(await findByText('Applied')).toBeVisible();
  });

  it('allows filtering job openings.', async () => {
    // Arrange
    const jobIndexToFilter = 1;

    window.localStorage.setItem('authToken', authToken);
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

    const { findByText, getByPlaceholderText, getByText, queryByText } =
      await act(async () =>
        render(
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        )
      );

    await user.click(await findByText('Jobs'));

    for (const job of jobs) {
      expect(await findByText(job.title)).toBeVisible();
    }

    // Act
    const searchInput = getByPlaceholderText('Enter search term...');
    const submitBtn = getByText('Search');

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

  it('allows a user to apply for a job from the list of all job openings.', async () => {
    // Arrange
    window.localStorage.setItem('authToken', authToken);
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));
    JoblyApi.getJobs = vi.fn(() => Promise.resolve(jobs));
    JoblyApi.postApplication = vi.fn((username, jobId) =>
      Promise.resolve(jobId)
    );

    const user = userEvent.setup();

    const { findByText, queryAllByText } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    await user.click(await findByText('Jobs'));

    // Act
    await user.click(queryAllByText('Apply')[0]);

    // Assert
    expect(await findByText('Applied')).toBeVisible();
  });

  it("allows updating the user's profile.", async () => {
    // Arrange
    const updatedData = Object.freeze({
      firstName: 'Updated First',
      lastName: 'Updated Last',
      email: 'updated.email@email.com',
    });

    const updatedUser = { ...userData, ...updatedData };
    delete updatedUser.applications;
    Object.freeze(updatedUser);

    window.localStorage.setItem('authToken', authToken);
    JoblyApi.getUser = vi.fn(() => Promise.resolve(structuredClone(userData)));
    JoblyApi.patchUser = vi.fn(() => Promise.resolve(updatedUser));

    const user = userEvent.setup();

    const { findByLabelText, findByText, getByText } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    await user.click(await findByText('Profile'));

    const firstNameInput = await findByLabelText('First Name');
    const lastNameInput = await findByLabelText('Last Name');
    const emailInput = await findByLabelText('Email');

    expect(firstNameInput).toHaveValue(userData.firstName);
    expect(lastNameInput).toHaveValue(userData.lastName);
    expect(emailInput).toHaveValue(userData.email);

    // Act
    await user.clear(firstNameInput);
    await user.type(firstNameInput, updatedData.firstName);
    await user.clear(lastNameInput);
    await user.type(lastNameInput, updatedData.lastName);
    await user.clear(emailInput);
    await user.type(emailInput, updatedData.email);
    await user.click(getByText('Submit'));

    // Assert
    expect(await findByText('Profile Updated')).toBeVisible();

    await user.click(getByText('Home'));
    await user.click(getByText('Profile'));

    expect(await findByLabelText('First Name')).toHaveValue(
      updatedData.firstName
    );
    expect(await findByLabelText('Last Name')).toHaveValue(
      updatedData.lastName
    );
    expect(await findByLabelText('Email')).toHaveValue(updatedData.email);
  });
});
