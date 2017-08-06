import React from 'react';
import PropTypes from 'prop-types';

const Snackbar = ({ message }) =>
  <div id="snackbar" className="show">
    {message}
  </div>;

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
};
export default Snackbar;
