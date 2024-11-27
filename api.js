import axios from './frontend/node_modules/axios';

// ==================================================

let BASE_URL;
if (typeof process !== 'undefined') {
  BASE_URL = process.env.REACT_APP_BASE_URL;
} else if (typeof import.meta !== 'undefined') {
  BASE_URL = import.meta.env.REACT_APP_BASE_URL;
}

BASE_URL ||= 'http://localhost:3001';

// --------------------------------------------------

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // The token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, data, method);

    // There are multiple ways to pass an authorization token,
    // this is how you pass it in the header.
    // This has been provided to show you another way to pass the token.
    // You are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = method === 'get' ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error('API Error:', err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // --------------------------------------------------
  // Individual API routes

  /**
   * Registers a new user.
   *
   * @param {Object} user - { username, password, firstName, lastName, email }
   * @returns {String} A new authentication token.
   */
  static async registerUser(user) {
    const res = await this.request('auth/register', user, 'post');
    return res.token;
  }

  /**
   * Logs in a user.
   *
   * @param {Object} userAndPass - { username, password }
   * @returns {String} A new authentication token.
   */
  static async loginUser(userAndPass) {
    const res = await this.request('auth/token', userAndPass, 'post');
    return res.token;
  }

  /**
   * Gets all companies.
   *
   * @param {Object} filters - Query parameters for filtering list of companies.
   *   Currently, they are name, minEmployees, and maxEmployees.
   * @returns {Array}
   * [ { handle, name, description, numEmployees, logoUrl }, ...].
   */
  static async getCompanies(filters = {}) {
    const res = await this.request('companies', filters);
    return res.companies;
  }

  /**
   * Get details on a company by handle.
   *
   * @param {String} handle - The handle of the company to get data for.
   * @returns {Object}
   * { handle, name, description, numEmployees, logoUrl, jobs }
   * where jobs is [ { id, title, salary, equity }, ... ].
   */
  static async getCompany(handle) {
    const res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /**
   * Gets all jobs.
   *
   * @returns {Array}
   * [ { id, title, salary, equity, companyHandle, companyName }, ...].
   */
  static async getJobs() {
    const res = await this.request(`jobs`);
    return res.jobs;
  }

  /**
   * Gets data about a job.
   *
   * @param {String} id - ID of job to get.
   * @returns {Object} { id, title, salary, equity, company }
   * where company is { handle, name, description, numEmployees, logoUrl }.
   */
  static async getJob(id) {
    const res = await this.request(`jobs/${id}`);
    return res.job;
  }

  /**
   * Gets a user's info and job IDs of submitted applications.
   *
   * @param {String} username - The username of the account to get.
   * @returns {Object}
   * { username, first_name, last_name, is_admin, jobs }
   * where jobs is [ id, ... ].
   */
  static async getUser(username) {
    const res = await this.request(`users/${username}`);
    return res.user;
  }

  /**
   * Updates a user's info.
   *
   * @param {String} username - The username of the user to update.
   * @param {Object} data - Can include any of
   * { firstName, lastName, password, email }.
   * @returns {Object} { username, firstName, lastName, email, isAdmin }
   */
  static async patchUser(username, data) {
    const res = await this.request(`users/${username}`, data, 'patch');
    return res.user;
  }

  /**
   * Has a user apply to a job opening.
   *
   * @param {String} username - Username of user applying to a job.
   * @param {String} jobId - ID of the job being applied to.
   * @returns {String} The job ID.
   */
  static async postApplication(username, jobId) {
    const res = await this.request(
      `users/${username}/jobs/${jobId}`,
      {},
      'post'
    );
    return res.applied;
  }
}

// ==================================================

// for now, put token ("testuser" / "password" on class)
JoblyApi.token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ' +
  'SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0.' +
  'FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc';

// ==================================================

export default JoblyApi;
