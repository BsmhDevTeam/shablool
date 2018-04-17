import React from 'react';
import { Link } from 'react-router-dom';

const GameClose = () => (
  <div id="game-close">
    <div className="game-background" />
    <div>
      <Link
        to="/"
        className="btn btn-primary show-leaders-btn"
      >
        לדף הבית
      </Link>
    </div>
    <div className="row">
      <div id="title">
        <h1>המשחק הסתיים</h1>
      </div>
    </div>
  </div>
  );

export default GameClose;
