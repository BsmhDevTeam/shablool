import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Game from '/imports/api/games/games';
import Image from '/imports/api/images/images';

const QuizCard = ({ quiz, actions }) => {
  const showDeleteAlert = () => {
    actions.showDeleteAlert(quiz);
  };
  const forkQuiz = () => {
    actions.forkQuiz(quiz);
  };
  const initGame = () => {
    const game = new Game({ quiz });
    game.applyMethod('initGame', []);
    FlowRouter.go('Game.Play', { code: game.code });
  };
  const quizImage = Image.findOne({ _id: quiz.image });
  return (
    <div className="panel panel-default quiz-card" id={`quiz-card-${quiz._id}`}>
      <div className="panel-body">
        <div className="row">
          <div className="col-md-3">
            <div className="quiz-card-img-area">
              <div className="quiz-panel-img-area">
                <img
                  className="quiz-panel-img"
                  src={quiz.image === 'no-image' ? '/img/default.png' : quizImage.link()}
                  alt="quiz"
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <h5 className="quiz-title">{quiz.title}</h5>
            <p><strong>{quiz.questions.length} </strong><span>שאלות</span></p>
            <p>
              <span className="quiz-owner-span">
                {`נוצר ע"י ${Meteor.users.findOne(quiz.owner).services.gitlab.username}`}
              </span>
            </p>
            <p><span>{quiz.createdAt.toLocaleString()}</span></p>
          </div>
          <div className="col-md-5 quiz-card-buttons-area">
            {quiz.owner === Meteor.userId()
              ? <span>
                <div className="col-md-4">
                  <a
                    href="javascript:void(0)"
                    className="delete quiz-card-link"
                    onClick={showDeleteAlert}
                  >
                    <span className="glyphicon glyphicon-remove quiz-card-link-text-icon" />
                    <span className="quiz-card-link-text">מחק שאלון</span>
                  </a>
                </div>
                <div className="col-md-4">
                  <a
                    href={`/EditQuiz/${quiz._id}`}
                    className="star quiz-card-link"
                  >
                    <span className="glyphicon glyphicon-pencil quiz-card-link-text-icon" />
                    <span className="quiz-card-link-text quiz-card-link-text">
                        ערוך שאלון
                      </span>
                  </a>
                </div>
                <div className="col-md-4 quiz-card-start-button-area">
                  <button
                    className="btn btn-primary start-game-btn"
                    onClick={initGame}
                  >
                    <span>התחל משחק! </span>
                    <span className="glyphicon glyphicon-play" />
                  </button>
                </div>
              </span>
              : <span>
                <div className="col-md-6">
                  <a
                    href="javascript:void(0)"
                    className="delete quiz-card-link"
                    onClick={forkQuiz}
                  >
                    <span className="glyphicon glyphicon-duplicate quiz-card-link-text-icon" />
                    <span className="quiz-card-link-text quiz-card-link-text">
                        העתק שאלון
                      </span>
                  </a>
                </div>
                <div className="col-md-6">
                  <a
                    href={`/ViewQuiz/${quiz._id}`}
                    className="quiz-card-link"
                  >
                    <span className="glyphicon glyphicon-info-sign quiz-card-link-text-icon" />
                    <span className="quiz-card-link-text quiz-card-link-text">
                        צפה בפרטים
                      </span>
                  </a>
                </div>
              </span>}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {quiz.getTags().map(t => <TagTemplate key={t._id} tag={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

QuizCard.propTypes = {
  quiz: PropTypes.instanceOf(Object).isRequired,
  actions: PropTypes.instanceOf(Object).isRequired,
};

const TagTemplate = ({ tag }) => (
  <h4 className="pull-right tag">
    <span className="label label-info" aria-hidden="true">
      {tag.name}
    </span>
  </h4>
);

TagTemplate.propTypes = {
  tag: PropTypes.instanceOf(Object).isRequired,
};

export default QuizCard;
