import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const MainForm = () => {
  const gameReg = (event) => {
    event.preventDefault();
    alert('ziby');
    const gameId = event.target.gameId.value;
    FlowRouter.go('Manage.Game', { gameId });
  };
  return (
    <form onSubmit={gameReg}>
      <div className="row">
        <input
          type="text"
          name="gameId"
          id="main-input"
          className="input"
          placeholder="הכנס קוד שאלון"
        />
      </div>
      <div className="row">
        <button
          className="btn btn-primary"
          type="submit"
          id="start-game-btn"
        >
          התחל משחק!
        </button>
      </div>
    </form>
  );
};

export default MainForm;
