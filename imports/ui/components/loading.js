import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ color = 'grey' }) =>
  <div id="loading">
    <div className="lds-css">
      <div className={`lds-ring ${color}-ring`}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>;

Loading.propTypes = {
  color: PropTypes.string,
};

Loading.defaultProps = {
  color: 'grey',
};

export default Loading;
