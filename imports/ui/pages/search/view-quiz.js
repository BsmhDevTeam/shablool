import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';
import Quiz from '/imports/api/quizes/quizes';
import Loading from '/imports/ui/components/loading';

const glyphIcons = {
  1: 'fa fa-star',
  2: 'fa fa-square',
  3: 'fa fa-circle',
  4: 'fa fa-heart',
};

const ViewQuiz = ({ quiz }) => (
  <div id="view-quiz">
    <div className="row">
      <div className="col-sm-12">
        <div className="page-header">
          <h1>{quiz.title}</h1>
        </div>
      </div>
    </div>
    {quiz.questions.map(q => (
      <div key={q._id} className="row">
        <RenderQuestion question={q} />
      </div>
    ))}
  </div>
);

ViewQuiz.propTypes = {
  quiz: PropTypes.instanceOf(Object).isRequired,
};

const RenderQuestion = ({ question }) => (
  <div id="view-quiz">
    <div className="panel panel-default">
      <div className="panel-heading">
        <h4>{question.text}</h4>
      </div>
      <div className="panel-body">
        <div className="border row">
          {question.answers.map((answer, index) => (
            <RenderAnswer key={answer._id} answer={answer} index={index + 1} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

RenderQuestion.propTypes = {
  question: PropTypes.instanceOf(Object).isRequired,
};

const RenderAnswer = ({ answer, index }) => (
  <div
    className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col"
    key={answer.id}
  >
    <div className="answer-btn-area">
      <div className={`well btn-answer-${index} answer-button`}>
        <i className={`${glyphIcons[answer.order]} answer-icon`} />
        <h3 className="answer-text">{answer.text}</h3>
      </div>
    </div>
  </div>
);

RenderAnswer.propTypes = {
  answer: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
};

const ViewQuizContainer = ({ loading, quizId }) => {
  if (loading) return <Loading />;
  const quiz = Quiz.findOne(quizId);
  return <ViewQuiz quiz={{ ...quiz }} />;
};

ViewQuizContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  quizId: PropTypes.string.isRequired,
};

export default createContainer(({ id }) => {
  const quizHandle = Meteor.subscribe('quizes.get', id);
  const loading = !quizHandle.ready();
  return {
    loading,
    quizId: id,
  };
}, ViewQuizContainer);
