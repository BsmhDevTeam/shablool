import React from 'react';

const QuestionForm = ({ question, validations, actions }) => (
  <div className="form-horizontal">
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="form-group">
          <div className="col-lg-8">
            <div className={`form-group ${validations.text ? 'has-error' : ''}`}>
              <input
                name="text"
                value={question.text}
                className="form-control input-lg"
                placeholder="שאל/י שאלה"
                onChange={actions.changeQuestionText(question._id)}
              />
              {validations.text
                ? <label className="control-label" htmlFor="text">{validations.text}</label>
                : ''}
            </div>
          </div>
          <div className="col-lg-3">
            <div className={`form-group ${validations.time ? 'has-error' : ''}`}>
              <label htmlFor="time" className="control-label col-lg-6">זמן לשאלה:</label>
              <input
                className="form-control input-lg col-lg-6"
                value={question.time}
                onChange={actions.changeQuestionTime(question._id)}
              />
              {validations.time
                ? <label className="control-label" htmlFor="time">{validations.time}</label>
                : ''}
            </div>
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
        {question.answers.map((a, i) => {
          const answerValidations = validations.answers ? validations.answers[i] : {};
          return (
            <RenderAnswer
              key={a._id}
              answer={a}
              validations={answerValidations}
              changeText={actions.changeAnswerText(question._id)}
              changePoints={actions.changeAnswerPoints(question._id)}
            />
          );
        })}
      </div>
    </div>
  </div>
);

const RenderAnswer = ({ answer, validations, changeText, changePoints }) => (
  <div className="form-group">
    <div className="col-lg-9">
      <div className={`form-group ${validations.text ? 'has-error' : ''}`}>
        <label htmlFor="text" className="control-label col-lg-1">1</label>
        <input
          name="text"
          value={answer.text}
          className="form-control col-lg-11"
          placeholder="הכנס/י תשובה"
          onChange={changeText(answer._id)}
        />
        {validations.text
          ? <label className="control-label" htmlFor="text">{validations.text}</label>
          : ''}
      </div>
    </div>
    <div className="col-lg-3">
      <div className={`form-group ${validations.points ? 'has-error' : ''}`}>
        <label htmlFor="points" className="control-label col-lg-4">ניקוד</label>
        <input
          value={answer.points}
          className="form-control col-lg-6"
          onChange={changePoints(answer._id)}
        />
        {validations.points
          ? <label className="control-label" htmlFor="points">{validations.points}</label>
          : ''}
      </div>
    </div>
  </div>
);

export default QuestionForm;
