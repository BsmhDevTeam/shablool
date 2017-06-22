import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import Quiz from '../../../api/quizes/quizes';
import Loading from '../../components/loading';

const ViewQuiz = ({ quiz }) => (
  <div id="view-quiz">
    <div className="row">
      <div className="col-sm-12">
        <div className="page-header">
          <h1>{quiz.title}</h1>
        </div>
      </div>
    </div>
    {quiz.questions.map(q =>
      <div key={q._id} className="row">
        <RenderQuesion question={q} />
      </div>,
      )}
  </div>
  );

const RenderQuesion = ({ question }) =>
  <div>
    <div className="panel panel-default">
      <div className="panel-heading">
        <h4>{question.text}</h4>
      </div>
      <div className="panel-body">
        {question.answers.map((answer, index) =>
          <RenderAnswer key={answer._id} answer={answer} index={index + 1} />,
        )}
      </div>
    </div>
  </div>;

const RenderAnswer = ({ answer, index }) =>
  <div className="row">
    <p className="fab-margin">{index}. {answer.text}</p>
  </div>;

const ViewQuizContainer = ({ loading, quizId }) => {
  if (loading) return <Loading />;
  const quiz = Quiz.findOne(quizId);
  return <ViewQuiz quiz={{ ...quiz }} />;
};

export default createContainer(({ id }) => {
  const quizHandle = Meteor.subscribe('quizes.get', id);
  const loading = !quizHandle.ready();
  return {
    loading,
    quizId: id,
  };
}, ViewQuizContainer);
