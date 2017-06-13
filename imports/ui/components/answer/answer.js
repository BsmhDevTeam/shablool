import React from 'react';

const Answer = ({ answer, index, actions }) => (
  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col" key={answer.id}>
    <div className="answer-btn-area">
      <button type="button" className={`btn btn-answer-${index} answer-button`} onClick={actions.selectAnswer(answer._id)}>
        <i className={`fa fa-answer-${index} answer-icon`} />
        <h3>{answer.text}</h3>
      </button>
    </div>
  </div>
);

export default Answer;
