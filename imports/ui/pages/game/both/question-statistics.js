import React from 'react';
import Answers from '/imports/ui/components/answers';
import GameNavbar from '/imports/ui/components/game-navbar';
import AnswerBar from '/imports/ui/components/answer-bar-chart';

const QuestionStatistics = ({ game }) => {
  const question = game.lastQuestionToStart();

  const showLeaders = () => {
    game.applyMethod('showLeaders', []);
  };

  return (
    <div id="question">
      <div className="question-background" />
      <div className="row">
        <GameNavbar text={question.text} num="" />
      </div>
      {game.isManager()
        ? <a
          href="javascript:void(0)"
          className="btn btn-primary show-leaders-btn"
          onClick={showLeaders}
        >
            לטבלת המובילים
          </a>
        : ''}
      <div className="row">
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 padding-top">
          <p className="count-down-timer-num">
            {game.getQuestionTimeLeft(question._id)}
          </p>
        </div>
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <AnswerBar game={game} />
        </div>
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 padding-top">
          <p className="answer-count" id="answer-count-number">
            {game.getLastQuestionAnswerCount()}
          </p>
          <p className="answer-count">תשובות</p>
        </div>
      </div>
      <Answers answers={question.answers} game={game} />
      {game.isManager() ? <audio src="/gong.mp3" autoPlay /> : ''}
    </div>
  );
};

export default QuestionStatistics;
