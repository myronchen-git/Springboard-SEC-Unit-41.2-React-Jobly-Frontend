import PropTypes from 'prop-types';
import { useState } from 'react';

// ==================================================

/**
 * Provides a search bar for searching the list of all items.  Only allows
 * searching company names, job titles, or similar.
 *
 * @param {Object} props - React component properties.
 * @param {Function} props.retrieveItems - Calls Jobly's backend API to
 *   retrieve all items, using a given filter.
 * @param {String} props.filterName - Name of the filter to be used in the API
 *   call.
 */
function SearchBar({ retrieveItems, filterName }) {
  const initialFormData = { [filterName]: '' };
  const [formData, setFormData] = useState(initialFormData);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const filtersToSend = formData[filterName] === '' ? {} : formData;
    await retrieveItems(filtersToSend);
  }

  return (
    <form className="SearchBar" onSubmit={handleSubmit}>
      <input
        type="search"
        name={filterName}
        placeholder="Enter search term..."
        value={formData[filterName]}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// ==================================================

SearchBar.propTypes = {
  retrieveItems: PropTypes.func.isRequired,
  filterName: PropTypes.string.isRequired,
};

export default SearchBar;
