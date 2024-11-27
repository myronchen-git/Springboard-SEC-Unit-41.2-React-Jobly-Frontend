import PropTypes from 'prop-types';

// ==================================================

function NotFound({ resourceName = '' }) {
  return <section>{resourceName}Not Found</section>;
}

// ==================================================

NotFound.propTypes = {
  resourceName: PropTypes.string,
};

export default NotFound;
