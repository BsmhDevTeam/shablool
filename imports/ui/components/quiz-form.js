import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Quiz from '/imports/api/quizes/quizes.js';
import QuestionForm from './question-form.js';

// validations
const validateTitle = (title) => {
  let message;
  const quiz = new Quiz({ title });
  quiz.validate(
    {
      fields: ['title'],
    },
    err => message = err && err.reason,
  );
  return message;
};

const QuizForm = ({ quiz, validate, actions }) => {
  const titleValidation = validate && validateTitle(quiz.title);
  return (
    <div id="quiz-form">
      <div className="row">
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="">
              <div
                className={`form-group ${titleValidation ? 'has-error' : ''}`}
              >
                <input
                  name="title"
                  className="input-title form-control"
                  placeholder="כותרת שאלון"
                  value={quiz.title}
                  onChange={actions.changeQuizTitle}
                />
                {titleValidation
                  ? <label className="control-label" htmlFor="title">
                    {titleValidation}
                  </label>
                  : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
      {quiz.questions.map(q => (
        <div key={q._id} className="row">
          <QuestionForm question={q} validate={validate} actions={actions} />
        </div>
      ))}
      <div className="row" id="add-question-btn-row">
        <div className="flatly classic-padding-bottom">
          <button className="btn btn-lg btn-block" onClick={actions.addQuestion}>
            <span className="glyphicon glyphicon-plus" aria-hidden="true" />
            <span> הוסף שאלה</span>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="panel panel-default">
          <div className="panel-body" id="submit-panel">
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group-lg">
                      <label htmlFor="isPrivate" className="control-label">
                        מי יכול למצוא את השאלון
                      </label>
                      <select
                        name="isPrivate"
                        className="is-private form-control"
                        onChange={actions.changeQuizPrivacy}
                        value={quiz.private}
                      >
                        <option value="false">כולם</option>
                        <option value="true">רק אני</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <form onSubmit={actions.addTag}>
                      <label htmlFor="tag" className="control-label">
                        הוספת תגיות
                      </label>
                      <input name="tag" className="form-control input-lg" />
                    </form>
                  </div>
                </div>
                <div className="row">
                  <div className="">
                    {quiz.tags.map(t => (
                      <TagTemplate key={t._id} tag={t} actions={actions} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="dropzone">
                  <Dropzone
                    accept="image/jpeg, image/png, image/jpg"
                    onDrop={files => actions.changeQuizImage(files)}
                  >
                    <p>גרור תמונה או תלחץ על מנת לבחור אחת</p>
                  </Dropzone>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="flatly classic-padding-top">
                <button
                  id="quiz-form-submit"
                  className="btn btn-success btn-lg btn-block"
                  onClick={actions.uploadImages}
                >
                  <span className="glyphicon glyphicon-ok" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

QuizForm.propTypes = {
  quiz: PropTypes.instanceOf(Object).isRequired,
  validate: PropTypes.bool.isRequired,
  actions: PropTypes.instanceOf(Object).isRequired,
};

const TagTemplate = ({ tag, actions }) => (
  <h3 className="pull-right tag">
    <span
      className="label label-info clickable"
      aria-hidden="true"
      onClick={actions.removeTag(tag._id)}
    >
      {tag.name}
    </span>
  </h3>
);

TagTemplate.propTypes = {
  tag: PropTypes.instanceOf(Object).isRequired,
  actions: PropTypes.instanceOf(Object).isRequired,
};

export default QuizForm;
