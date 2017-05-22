import React from 'react';
import uuidV4 from 'uuid/v4';

import QuestionForm from '../../components/question-form/question-form.js';

import Tag from '../../../api/tags/tags';
import Quiz from '../../../api/quizes/quizes';

// Utilities
const newQuestion = () => {
  const answers = [1, 2, 3, 4].map(() => ({
    _id: uuidV4(),
    text: '',
    points: 0,
  }));
  return {
    _id: uuidV4(),
    text: '',
    time: 30,
    answers,
  };
};

const normalizeTagName = str =>
  [str]
    .map(s => s.trim())
    .map(s => s.toLocaleLowerCase())
    .map(s => s.replace(/\s+/g, '-'))
    .pop();

// React Page
export default class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [newQuestion()],
      tags: [],
    };
  }

  render() {
    const addQuestion = () => {
      this.setState({
        questions: [...this.state.questions, newQuestion()],
      });
    };

    const removeQuestion = id => () => {
      this.setState({
        questions: this.state.questions.filter(q => q._id !== id),
      });
    };
    
    const addTag = (e) => {
      e.preventDefault();

      const form = e.target;
      const tagName = form.tag.value;

      const newTag = {
        _id: uuidV4(),
        name: normalizeTagName(tagName),
      };

      this.setState({
        tags: [...this.state.tags, newTag],
      });

      form.tag.value = '';
    };

    const removeTag = id => () => {
      this.setState({
        tags: this.state.tags.filter(t => t._id !== id),
      });
    };

    return (
      <div id="create-quiz">
        <div className="row">
          <div className="col-sm-12">
            <div className="page-header">
              <input type="text" className="input-title form-control" placeholder="כותרת שאלון" />
            </div>
          </div>
        </div>
        {this.state.questions.map(q => (
          <div key={q._id} className="row">
            <div className="col-sm-12">
              <QuestionForm question={q} removeQuestion={removeQuestion(q._id)} />
            </div>
          </div>
        ))}
        <div className="row">
          <div className="col-sm-12">
            <button className="btn btn-primary btn-lg btn-block" onClick={addQuestion}>
              <span className="glyphicon glyphicon-plus" aria-hidden="true" />
            </button>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-9">
            <div className="row">
              <div className="col-lg-4">
                <form onSubmit={addTag}>
                  <label htmlFor="tag" className="control-label">הוספת תגיות</label>
                  <input name="tag" className="form-control input-lg" />
                </form>
              </div>
              <div className="col-lg-8">
                {this.state.tags.map(t => (
                  <TagTemplate key={t._id} tag={t} removeTag={removeTag(t._id)} />
                ))}
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="form-group-lg">
              <label htmlFor="isPrivate" className="control-label">מי יכול למצוא את השאלון</label>
              <select name="isPrivate" className="is-private form-control">
                <option value="false">כולם</option>
                <option value="true">רק אני</option>
              </select>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-12">
            <button type="button" className="save-quiz btn btn-success btn-lg col-sm-2 pull-left"><span className="glyphicon glyphicon-ok" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    );
  }
}

const TagTemplate = ({ tag, removeTag }) => (
  <h2 className="pull-right">
    <span className="label label-info">
      {tag.name}
      <span
        className="glyphicon glyphicon-remove clickable"
        aria-hidden="true"
        onClick={removeTag}
      />
    </span>
  </h2>
  );


const saveQuiz = (event, templateInstance) => {
    // get quiz title
  const title = templateInstance.$('.input-title');

    // get quiestions
  const forms = templateInstance.$('.question-form');
  const questions = forms.map((i, form) => {
    const answers = [
      {
        text: form.answer1.value,
        points: parseInt(form.points1.value, 10),
      },
      {
        text: form.answer2.value,
        points: parseInt(form.points2.value, 10),
      },
      {
        text: form.answer3.value,
        points: parseInt(form.points3.value, 10),
      },
      {
        text: form.answer4.value,
        points: parseInt(form.points4.value, 10),
      },
    ];
    return {
      text: form.question.value,
      answers,
      order: i,
      time: parseInt(form.time.value, 10),
    };
  });


  console.log(title);
    // create quiz
  const quiz = new Quiz({
    title,
  });

    // validate quiz
  quiz.validate((e) => {
    console.log(e);
  });

    // get tags
  const tags = templateInstance.state.get('tags');
  const tagsId = tags.map((t) => {
      // check if tag exists
    const newTag = { name: t.name };
    const existTag = Tag.findOne(newTag); // TODO: better duplication checks
    return existTag ? existTag._id : new Tag(newTag).save();
  });
};
