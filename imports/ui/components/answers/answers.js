import React from 'react';
import Answer from '../answer/answer';

const Answers = ({ answers, game }) => (
  <div className="row">
    {answers.map((answer, index) => (
      <Answer
        answer={answer}
        index={index + 1}
        game={game}
        key={answer._id}
      />
      ))}
  </div>
  );

export default Answers;
