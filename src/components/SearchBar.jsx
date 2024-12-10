import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Col, Container, Form, Input, Row } from 'reactstrap';

import './SearchBar.css';

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
    <Form className="SearchBar" onSubmit={handleSubmit}>
      <Container className="p-0" fluid>
        <Row className="g-3" xs="1" sm="2">
          <Col sm="9">
            <Input
              type="search"
              name={filterName}
              placeholder="Enter search term..."
              value={formData[filterName]}
              onChange={handleChange}
            />
          </Col>
          <Col sm="3">
            <Button type="submit">Search</Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

// ==================================================

SearchBar.propTypes = {
  retrieveItems: PropTypes.func.isRequired,
  filterName: PropTypes.string.isRequired,
};

export default SearchBar;
