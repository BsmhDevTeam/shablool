import React from 'react';
import { Meteor } from 'meteor/meteor';

const GameCardPlayed = ({ game }) => {
  console.log('game:');
  console.log(game);
  const showStatistics = () => {

  };

  return (
    <div className="panel panel-default game-card" id={`game-card-${game._id}`}>
      <div className="panel-body">
        <div className="row">
          <div className="col-md-3">
            <img
              className="game-panel-img"
              src="../../img/quiz-default.png"
              alt="game"
            />
          </div>
          <div className="col-md-4">
            <h5 className="game-title">{game.quiz.title}</h5>
            <p>
              <span className="game-owner-span">
                {`הועלה ע"י ${Meteor.users.findOne(game.quiz.owner).services.github.username}`}
              </span>
            </p>
            <p><strong>{game.getScoreByUserId()} </strong><span>נקודות</span></p>
            <p><span>מיקום</span><strong>{game.getPlaceByUserId()} </strong></p>
            <p><span>{game.createdAt}</span></p>
          </div>
          <div className="col-md-5 game-card-buttons-area">
            <span>
              <div className="col-md-4">
                <a
                  href="javascript:void(0)"
                  className="star game-card-link"
                  onClick={showStatistics}
                >
                  <span className="fa fa-area-chart game-card-link-text-icon" />
                  <span className="game-card-link-text game-card-link-text">
                    הצג סטטיסטיקות
                  </span>
                </a>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCardPlayed;
