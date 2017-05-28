import React from 'react';

const ViewQuiz = ({ quiz }) => {
  return (
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
          <RenderQuesion question={q} />
        </div>
       ))}
    </div>
  );
};

const RenderQuesion = ({ question }) => (
  <div>
    <div className="panel panel-default">
      <div className="panel-heading">
        <h1>{question.text}</h1>
      </div>
    </div>
    <div className="panel-body">
      {question.answers.map((answer, index) => (
        <RenderAnswer
          key={answer._id}
          answer={answer}
        />
      ))}
    </div>
  </div>
);

const RenderAnswer = ({ answer, index }) => (
  <div className="row">
    <div className="col-md-1">
      {index}
    </div>
    <div className="col-md-11">
      {answer.text}
    </div>
  </div>
);

export default ViewQuiz;
