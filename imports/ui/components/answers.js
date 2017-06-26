import React from 'react';
import { Meteor } from 'meteor/meteor';
import { eventTypes } from '../../api/games/games';

const glyphIcons = {
  1: 'fa fa-star',
  2: 'fa fa-square',
  3: 'fa fa-circle',
  4: 'fa fa-heart',
};

const Answers = ({ answers, game }) => (
  <div className="row">
    {answers.map((answer, index) => (
      <Answer answer={answer} index={index + 1} game={game} key={answer._id} />
    ))}
  </div>
);

const Answer = ({ answer, index, game }) => {
  const selectAnswer = () => {
    game.applyMethod('playerAnswer', [
      Meteor.userId(),
      game.lastQuestionToStartId(),
      answer._id,
    ]);
  };
  const isRightAnswer = answer.points > 0;
  const calculateOpacity = () => (!isRightAnswer && game.getLastEvent().nameType === eventTypes.QuestionEnd ? 'wrong-answer' : '');

  return (
    <div
      className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col"
      key={answer.id}
    >
      <div className="answer-btn-area">
        <button
          type="button"
          className={`btn btn-answer-${index} answer-button ${calculateOpacity()}`}
          onClick={selectAnswer}
        >
          {
            isRightAnswer && game.getLastEvent().nameType === eventTypes.QuestionEnd
            ? <i className="fa fa-check answer-icon right-answer-icon" />
            : ''
          }
          <i className={`${glyphIcons[answer.order]} answer-icon`} />
          <h3>{answer.text}</h3>
        </button>
      </div>
    </div>
  );
};

export default Answers;
