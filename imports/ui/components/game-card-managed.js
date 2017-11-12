import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment';
import 'moment/locale/he';

const GameCardManaged = ({ game }) => {
  const showStatistics = () => {
    FlowRouter.go('Manage.Game', { code: game.code });
  };
  const fromNow = () => {
    moment.locale('he');
    return moment(new Date(game.createdAt)).fromNow();
  };
  return (
    <div className="panel panel-default game-card">
      <div className="panel-body">
        <div className="row">
          <div className="col-md-3">
            <img className="game-panel-img" src="/img/quiz-default.png" alt="game" />
          </div>
          <div className="col-md-4">
            <h5 className="game-title">
              {game.quiz.title}
            </h5>
            <p>
              <span className="game-owner-span">
                {`מריץ המשחק: ${Meteor.users.findOne(game.quiz.owner).username}`}
              </span>
            </p>
            <p>
              <span>
                {fromNow()}
              </span>
            </p>
          </div>
          <div className="col-md-5 game-card-buttons-area">
            <span>
              <div className="col-md-4">
                <div className="star game-card-link">
                  <span className="fa fa-users game-card-info-text-icon" />
                  <span className="game-card-link-text game-card-info-text">
                    <strong>{game.getPlayersCount()}</strong> שחקנים
                  </span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="star game-card-link">
                  <span className="fa fa-question game-card-info-text-icon" />
                  <span className="game-card-link-text game-card-info-text">
                    <strong>{game.quiz.questions.length}</strong> שאלות
                  </span>
                </div>
              </div>
              <div className="col-md-4">
                <a
                  href="javascript:void(0)"
                  className="star game-card-link"
                  onClick={showStatistics}
                >
                  <span className="fa fa-area-chart game-card-link-text-icon" />
                  <span className="game-card-link-text game-card-link-text">הצג סטטיסטיקות</span>
                </a>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

GameCardManaged.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

export default GameCardManaged;
