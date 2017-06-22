import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import GameNavbar from '../../components/game-navbar';

const Winner = ({ winner }) => {
  const backToHome = () => {
    FlowRouter.go('Game.Home');
  };
  return (
    <div id="winner">
      <div className="game-background" />
      <div className="row">
        <div className="back-home-button">
          <button className="btn btn-primary" onClick={backToHome}>
            סיים
          </button>
        </div>
      </div>
      <div className="row">
        <GameNavbar text="Winner" num="" />
      </div>
      <div className="row">
        <div className="winner-name">
          <p>{winner.userName}</p>
        </div>
      </div>
      <div className="row">
        <div className="my-icon">
          <span className="fa-stack fa-lg">
            <i className="fa fa-circle fa-stack-2x trophy-cover" />
            <i className="fa fa-trophy fa-stack-1x fa-inverse fa-spin trophy" />
          </span>
        </div>
      </div>
      <div className="row">
        <div className="winner-score">
          <p>!with {winner.userScore} points</p>
        </div>
      </div>
    </div>
  );
};

export default Winner;
