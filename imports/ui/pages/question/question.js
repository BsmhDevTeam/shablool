import { Meteor } from 'meteor/meteor';
import React from 'react';
import Answers from '../../components/answers/answers';
import GameNavbar from '../../components/game-navbar/game-navbar';
import BarChart from '../../components/bar-chart/bar-chart';
import CountdownTimer from '../../components/count-down-timer/count-down-timer';

const Question = ({ game, isEnded }) => {
  const question = game.lastQuestionToStart();
  const nextQuestion = () => {
    game.applyMethod('nextQuestion', []);
  };
  return (
    <div id="question">
      <div className="container">
        <div className="row">
          <GameNavbar text={question.text} num={question.order} />
        </div>
        <div className="row">
          <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            {isEnded ? '' : <CountdownTimer secondsRemaining={question.time} />}
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            {isEnded
              ? <BarChart answers={game} />
              : <img src="/img/questionDefaultImg.png" alt="defaultImg" />}
          </div>
          <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            {game.quiz.owner === Meteor.user()
              ? <a
                href="javacript:void(0)"
                className="btn btn-primary"
                onClick={nextQuestion}
              >
                  לשאלה הבאה
                </a>
              : ''}
            <p className="answer-count" id="answer-count-number">
              {game.answerCount()}
            </p>
            <p className="answer-count">Answers</p>
          </div>
        </div>
        <Answers answers={question.answers} game={game} />
      </div>
    </div>
  );
};

export default Question;
