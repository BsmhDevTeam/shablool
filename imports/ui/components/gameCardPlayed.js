import React from 'react';
import { Meteor } from 'meteor/meteor';

const GameCardPlayed = ({ game }) => {
  const showDate = date => (
    `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  );
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
            
            <p><span>{showDate(game.createdAt)}</span></p>
          </div>
          <div className="col-md-5 game-card-buttons-area">
            <span>
              <div className="col-md-4">
                <div className="star game-card-link">
                  <span className="fa fa-trophy game-card-info-text-icon" />
                  <span className="game-card-link-text game-card-info-text">מיקום <strong>{game.getPlaceByUserId()}</strong></span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="star game-card-link">
                  <span className="fa fa-calculator game-card-info-text-icon" />
                  <span className="game-card-link-text game-card-info-text"><strong>{game.getScoreByUserId()} </strong>נקודות</span>
                </div>
              </div>
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
