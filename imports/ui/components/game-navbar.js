import React from 'react';

const GameNavbar = ({text, num}) => (
  <nav className="navbar navbar-default navbar-fixed-top navbar-game">
    <div className="container-fluid navabr-message-area">
      <div className="navbar-bis-header">
        <p className="">
          <span>
            {text}
          </span>
          <strong>{num}</strong>
        </p>
      </div>
    </div>
  </nav>
);

export default GameNavbar;
