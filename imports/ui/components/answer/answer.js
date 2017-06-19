import React from 'react';
import { Meteor } from 'meteor/meteor';

const Answer = ({ answer, index, game }) => {
  const selectAnswer = () => {
    game.selectAnswer(
      Meteor.userId(),
      game.lastQuestionToStartId(),
      answer._id,
    );
  };
  return (
    <div
      className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col"
      key={answer.id}
    >
      <div className="answer-btn-area">
        <button
          type="button"
          className={`btn btn-answer-${index} answer-button`}
          onClick={selectAnswer}
        >
          <i className={`fa fa-answer-${index} answer-icon`} />
          <h3>{answer.text}</h3>
        </button>
      </div>
    </div>
  );
};

export default Answer;
