import React from 'react';
import Answers from '../../components/answers';
import GameNavbar from '../../components/game-navbar';
import CountdownTimer from '../../components/count-down-timer';

const Question = ({ game }) => {
  const question = game.lastQuestionToStart();

  return (
    <div id="question">
      <div className="question-background" />
      <div className="row">
        <GameNavbar text={question.text} num="" />
      </div>
      <div className="row">
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 padding-top">
          <CountdownTimer secondsRemaining={game.getQuestionTimeLeft(question._id)} />
        </div>
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <img className="question-image" src="/img/quiz-default.png" alt="defaultImg" />
        </div>
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 padding-top">
          <p className="answer-count" id="answer-count-number">
            {game.answerCount()}
          </p>
          <p className="answer-count">תשובות</p>
        </div>
      </div>
      <Answers answers={question.answers} game={game} />
    </div>
  );
};

export default Question;
