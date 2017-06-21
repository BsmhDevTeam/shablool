import { Meteor } from 'meteor/meteor';
import React from 'react';
import Answers from '../../components/answers/answers';
import GameNavbar from '../../components/game-navbar/game-navbar';
import AnswerBar from '../../components/bar-chart/bar-chart';

const QuestionStatistics = ({ game }) => {
  console.log('Hey, You are in the statistics page');
  const question = game.lastQuestionToStart();

  const nextQuestion = () => {
    game.applyMethod('nextQuestion', []);
  };

  return (
    <div id="question">
      <div className="question-background" />
      <div className="row">
        <GameNavbar text={question.text} num="" />
      </div>
      {game.quiz.owner === Meteor.userId()
            ? <a
              href="javacript:void(0)"
              className="btn btn-primary"
              onClick={nextQuestion}
            >
                לשאלה הבאה
              </a>
            : ''}
      <div className="row">
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 padding-top">
          <p className="count-down-timer-num">0</p>
        </div>
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <AnswerBar game={game} />
        </div>
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 padding-top">
          <p className="answer-count" id="answer-count-number">
            {game.answerCount()}
          </p>
          <p className="answer-count">Answers</p>
        </div>
      </div>
      <Answers answers={question.answers} game={game} />
    </div>
  );
};

export default QuestionStatistics;
