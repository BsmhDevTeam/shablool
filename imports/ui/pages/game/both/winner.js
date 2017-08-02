import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import GameNavbar from '/imports/ui/components/game-navbar';

const Winner = ({ game }) => {
  const backToHome = () => {
    const _ = game.isManager() ? game.applyMethod('closeGame', []) : null;
    FlowRouter.go('Home');
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
        <GameNavbar text="הזוכה הגדול" num="" />
      </div>
      <div className="row">
        <div className="winner-name">
          <p>{game.getWinner().userName}</p>
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
          <p>!with {game.getWinner().userScore} points</p>
        </div>
      </div>
    </div>
  );
};

Winner.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

export default Winner;
