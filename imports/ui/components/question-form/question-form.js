import React from 'react';

const QuestionForm = ({ question, actions }) => (
  <div className="form-horizontal">
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="form-group">
          <div className="col-lg-8">
            <input
              value={question.text}
              className="form-control input-lg"
              placeholder="שאל/י שאלה"
              onChange={actions.changeQuestionText(question._id)}
            />
          </div>
          <div className="col-lg-3">
            <label htmlFor="time" className="control-label col-lg-6">זמן לשאלה:</label>
            <input
              className="form-control input-lg col-lg-6"
              value={question.time}
              onChange={actions.changeQuestionTime(question._id)}
            />
          </div>
          <div className="col-lg-1">
            <button
              className="btn btn-danger btn-lg"
              onClick={actions.removeQuestion(question._id)}
            >
              <span className="glyphicon glyphicon-minus" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className="panel-body">
        {question.answers.map(answer => (
          <RenderAnswer
            key={answer._id}
            answer={answer}
            changeText={actions.changeAnswerText(question._id)}
            changePoints={actions.changeAnswerPoints(question._id)}
          />
          ))}
      </div>
    </div>
  </div>
);

const RenderAnswer = ({ answer, changeText, changePoints }) => (
  <div className="form-group">
    <div className="col-lg-9">
      <label htmlFor="answer" className="control-label col-lg-1">1</label>
      <input
        value={answer.text}
        className="form-control col-lg-11"
        placeholder="הכנס/י תשובה"
        onChange={changeText(answer._id)}
      />
    </div>
    <div className="col-lg-3">
      <label htmlFor="points" className="control-label col-lg-4">ניקוד</label>
      <input
        value={answer.points}
        className="form-control col-lg-6"
        onChange={changePoints(answer._id)}
      />
    </div>
  </div>
);

export default QuestionForm;
