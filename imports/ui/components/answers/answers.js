import React from 'react';
import Answer from '../answer/answer';

const Answers = ({ answers, actions }) => (
  <div className="container">
    <div className="row">
      {answers.map((answer, index) => (
        <Answer
          answer={answer}
          index={index + 1}
          action={actions.selectAnswer}
        />
      ))}
    </div>
  </div>
);

export default Answers;
