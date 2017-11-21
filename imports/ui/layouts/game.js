import React from 'react';

const GameLayout = ({ children }) =>
  <div id="game-layout">
    <div className="container">
      {children}
    </div>
  </div>;

export default GameLayout;
