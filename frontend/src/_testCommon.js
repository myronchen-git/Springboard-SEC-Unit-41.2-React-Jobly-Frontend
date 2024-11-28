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

// ==================================================

export { companies, companyDetails, jobs };
