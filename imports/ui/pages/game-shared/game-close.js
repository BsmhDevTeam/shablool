import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const GameClose = () => {
  const backToHome = () => {
    FlowRouter.go('Game.Home');
  };
  return (
    <div id="answer-sent">
      <div className="game-background" />
      <div className="row">
        <div className="back-home-button">
          <button className="btn btn-primary" onClick={backToHome}>
            לדף הבית
          </button>
        </div>
      </div>
      <div className="row">
        <div id="title">
          <h1>המשחק שאתה מחפש אינו קיים. נסה שוב</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-2 col-xl-offset-5 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
          <div>
            <span className="glyphicon glyphicon-ban-circle" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameClose;