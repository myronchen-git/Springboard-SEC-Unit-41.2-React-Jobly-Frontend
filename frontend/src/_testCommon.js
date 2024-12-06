const companies = Object.freeze([
  Object.freeze({
    handle: 'comp1',
    name: 'Company 1',
    description: 'Company 1 description.',
    numEmployees: 12,
    logoUrl: 'logo1.png',
  }),
  Object.freeze({
    handle: 'comp2',
    name: 'Company 2',
    description: 'Company 2 description.',
    numEmployees: 123,
    logoUrl: 'logo2.png',
  }),
  Object.freeze({
    handle: 'comp3',
    name: 'Company 3',
    description: 'Company 3 description.',
    numEmployees: 3,
  }),
  Object.freeze({
    handle: 'comp4',
    name: 'Company 4',
    description: 'Company 4 description.',
    logoUrl: 'logo4.png',
  }),
]);

const jobs = Object.freeze([
  Object.freeze({
    id: '1',
    title: 'Job 1',
    salary: 1,
    equity: 0.1,
    companyHandle: 'comp1',
    companyName: 'Company 1',
  }),
  Object.freeze({
    id: '2',
    title: 'Job 2',
    salary: 2,
    equity: 0.2,
    companyHandle: 'comp1',
    companyName: 'Company 1',
  }),
]);

const comp1Jobs = [];
[jobs[0], jobs[1]].forEach((job) => {
  const condensedJob = { ...job };
  delete condensedJob.companyHandle;
  delete condensedJob.companyName;
  comp1Jobs.push(Object.freeze(condensedJob));
});

const companyDetails = Object.freeze({
  handle: 'comp1',
  name: 'Company 1',
  description: 'Company 1 description.',
  numEmployees: 12,
  logoUrl: 'logo1.png',
  jobs: Object.freeze(comp1Jobs),
});

const userInfo = Object.freeze({
  username: 'testuser',
  password: 'password',
  firstName: 'First',
  lastName: 'Last',
  email: 'email@email.com',
});

// For JoblyApi.getUser().
// This is the response data from the API call to GET /users/:username .
const userData = Object.freeze({
  username: userInfo.username,
  firstName: userInfo.firstName,
  lastName: userInfo.lastName,
  email: userInfo.email,
  isAdmin: false,
  applications: Object.freeze([]),
});

// Ensure authentication token has payload with keys username and isAdmin.
// This authToken corresponds to { username: 'testuser', isAdmin: false }.
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ' +
  'SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0.' +
  'FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc';

// ==================================================

export { authToken, companies, companyDetails, jobs, userData, userInfo };
