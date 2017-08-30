import React from 'react';
import PropTypes from 'prop-types';

const GameNavbar = ({ text, num }) =>
  <nav className="navbar navbar-default navbar-fixed-top navbar-game">
    <div className="container-fluid navabr-message-area">
      <div className="navbar-bis-header">
        <p className="">
          <span>
            {text}
          </span>
          <strong>
            {num}
          </strong>
        </p>
      </div>
    </div>
  </nav>;

GameNavbar.propTypes = {
  text: PropTypes.string.isRequired,
  num: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default GameNavbar;
