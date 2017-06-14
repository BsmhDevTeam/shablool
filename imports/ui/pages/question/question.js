import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import Answers from '../../components/answers/answers';
import GameNavbar from '../../components/game-navbar/game-navbar';
import BarChart from '../../components/bar-chart/bar-chart';
import CountdownTimer from '../../components/count-down-timer/count-down-timer';

const Question = ({
  question,
  isEnded,
  actions,
}) => {
  const selectAnswer = (aId) => {
    PlayerAnswer(Meteor.user().id, question._id, aId);
  };

  const actions = {
    selectAnswer,
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
              ? <BarChart answers={answersGroupCount()} />
              : <img src="/img/questionDefaultImg.png" alt="defaultImg" />}
          </div>
          <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <p className="answer-count" id="answer-count-number">
              {answerCount()}
            </p>
            <p className="answer-count">Answers</p>
          </div>
        </div>
        <Answers answers={question.answers} actions={actions} />
      </div>
    </div>
  );
};

const QuestionContainer = ({
  loading,
  isEnded,
  actions,
}) => {
  if (loading) return <p>loading</p>;
  const question = Question.findOne();
  return (
    <Question
      question={question}
      isEnded={isEnded}
      actions={actions}
    />
  );
};

export default createContainer(({
  id,
  isEnded,
  actions,
}) => {
  const questionHandle = Meteor.subscribe('questions.get', id);
  const loading = !questionHandle.ready();
  return {
    loading,
    isEnded,
    actions,
  };
}, QuestionContainer);
