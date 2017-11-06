import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { eventTypes } from '/imports/startup/both/constants';

const glyphIcons = {
  1: 'fa fa-star',
  2: 'fa fa-square',
  3: 'fa fa-circle',
  4: 'fa fa-heart',
};

const Answers = ({ answers, game }) =>
  <div className="row">
    <div className="answers-btn-area-to-bottom">
      {answers.map((answer, index) =>
        <Answer answer={answer} index={index + 1} game={game} key={answer._id} />,
      )}
    </div>
  </div>;

Answers.propTypes = {
  answers: PropTypes.arrayOf(Object).isRequired,
  game: PropTypes.instanceOf(Object).isRequired,
};

const Answer = ({ answer, index, game }) => {
  const selectAnswer = () => {
    game.applyMethod('playerAnswer', [game.lastQuestionToStartId(), answer._id]);
  };

  const isSelected = game.gameLog.find(
    event => event.nameType === eventTypes.PlayerAnswer &&
    answer._id === event.answerId && event.playerId === Meteor.userId()) ? 'selected-answer' : '';

  const isRightAnswer = answer.points > 0;
  const calculateOpacity = () =>
    !isRightAnswer && game.getLastEvent().nameType === eventTypes.QuestionEnd ? 'wrong-answer' : '';

  return (
    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col" key={answer.id}>
      <div className="answer-btn-area">
        <button
          type="button"
          className={`btn btn-answer-${index} answer-button ${calculateOpacity()} ${isSelected}`}
          onClick={selectAnswer}
        >
          <div className="col-md-1 col-xs-1 col-sm-1 col-lg-1 col-xg-1">
            <i className={`${glyphIcons[answer.order]} answer-icon`} />
          </div>
          <div className="col-md-10 col-xs-10 col-sm-10 col-lg-10 col-xg-10">
            <h3>
              {answer.text}
            </h3>
          </div>
          <div className="col-md-1 col-xs-1 col-sm-1 col-lg-1 col-xg-1">
            {isRightAnswer && game.getLastEvent().nameType === eventTypes.QuestionEnd
              ? <i className="fa fa-check answer-icon right-answer-icon" />
              : ''}
          </div>
        </button>
      </div>
    </div>
  );
};

Answer.propTypes = {
  answer: PropTypes.instanceOf(Object).isRequired,
  game: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
};

export default Answers;
