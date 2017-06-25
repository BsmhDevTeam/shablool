import React from 'react';
import { Answer } from '/imports/api/quizes/quizes.js';

// validations
const validateText = (text) => {
  let message;
  const answer = new Answer({ text });
  answer.validate(
    {
      fields: ['text'],
    },
    err => (message = err && err.reason),
  );
  return message;
};

const validatePoints = (points) => {
  let message;
  const answer = new Answer({ points });
  answer.validate(
    {
      fields: ['points'],
      cast: true,
    },
    err => (message = err && err.reason),
  );
  return message;
};

const AnswerForm = ({ answer, index, validate, actions }) => {
  const textValidation = validate && validateText(answer.text);
  const pointsValidation = validate && validatePoints(answer.points);
  return (
    <div className="form-group">
      <div className="col-lg-9">
        <div className={`form-group ${textValidation ? 'has-error' : ''}`}>
          <label htmlFor="text" className="control-label col-lg-1">{index}</label>
          <input
            name="text"
            value={answer.text}
            className="form-control col-lg-11"
            placeholder="הכנס/י תשובה"
            onChange={actions.changeText(answer._id)}
          />
          {textValidation
            ? <label className="control-label" htmlFor="text">{textValidation}</label>
            : ''}
        </div>
      </div>
      <div className="col-lg-3">
        <div className={`form-group ${pointsValidation ? 'has-error' : ''}`}>
          <label htmlFor="points" className="control-label col-lg-4">ניקוד</label>
          <input
            value={answer.points}
            className="form-control col-lg-6"
            onChange={actions.changePoints(answer._id)}
          />
          {pointsValidation
            ? <label className="control-label" htmlFor="points">{pointsValidation}</label>
            : ''}
        </div>
      </div>
    </div>
  );
};

export default AnswerForm;
