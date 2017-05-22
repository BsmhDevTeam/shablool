import React from 'react';
import uuidV4 from 'uuid/v4';
import QuizForm from '../../components/quiz-form/quiz-form.js';

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
  [str].map(s => s.trim()).map(s => s.toLocaleLowerCase()).map(s => s.replace(/\s+/g, '-')).pop();

// React Page
export default class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      questions: [newQuestion()],
      tags: [],
      owner: 'Me',
      private: false,
    };
  }

  render() {
    const s = this.state;

    const changeQuizTitle = (e) => {
      this.setState({ title: e.target.value });
    };

    const addQuestion = () => {
      this.setState({
        questions: [...s.questions, newQuestion()],
      });
    };

    const removeQuestion = id => () => {
      this.setState({
        questions: s.questions.filter(q => q._id !== id),
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
        tags: [...s.tags, newTag],
      });

      form.tag.value = '';
    };

    const removeTag = id => () => {
      this.setState({
        tags: s.tags.filter(t => t._id !== id),
      });
    };

    const changeQuestionText = id => (e) => {
      const text$ = e.target.value;
      const questions$ = s.questions.map(q => (q._id !== id ? q : { ...q, text: text$ }));
      this.setState({ questions: questions$ });
    };

    const changeQuestionTime = id => (e) => {
      const time$ = e.target.value;
      const questions$ = s.questions.map(q => (q._id !== id ? q : { ...q, time: time$ }));
      this.setState({ questions: questions$ });
    };

    const changeAnswerText = qId => aId => (e) => {
      const text$ = e.target.value;
      const answers$ = s.questions
        .find(q => q._id === qId)
        .answers.map(a => (a._id !== aId ? a : { ...a, text: text$ }));
      const questions$ = s.questions.map(q => (q._id !== qId ? q : { ...q, answers: answers$ }));
      this.setState({ questions: questions$ });
    };

    const changeAnswerPoints = qId => aId => (e) => {
      const points$ = e.target.value;
      const answers$ = s.questions
        .find(q => q._id === qId)
        .answers.map(a => (a._id !== aId ? a : { ...a, points: points$ }));
      const questions$ = s.questions.map(q => (q._id !== qId ? q : { ...q, answers: answers$ }));
      this.setState({ questions: questions$ });
    };

    const actions = {
      changeQuizTitle,
      addQuestion,
      changeQuestionText,
      removeQuestion,
      changeQuestionTime,
      changeAnswerText,
      changeAnswerPoints,
      addTag,
      removeTag,
    };

    return <QuizForm quiz={s} actions={actions} />;
  }
}

<<<<<<< HEAD
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
=======
// TODO: CODE TO CONVERT

// const saveQuiz = (event, templateInstance) => {
//   // get quiz title
//   const title = templateInstance.$('.input-title');
//
//   // get quiestions
//   const forms = templateInstance.$('.question-form');
//   const questions = forms.map((i, form) => {
//     const answers = [
//       {
//         text: form.answer1.value,
//         points: parseInt(form.points1.value, 10),
//       },
//       {
//         text: form.answer2.value,
//         points: parseInt(form.points2.value, 10),
//       },
//       {
//         text: form.answer3.value,
//         points: parseInt(form.points3.value, 10),
//       },
//       {
//         text: form.answer4.value,
//         points: parseInt(form.points4.value, 10),
//       },
//     ];
//     return {
//       text: form.question.value,
//       answers,
//       order: i,
//       time: parseInt(form.time.value, 10),
//     };
//   });
//
//   console.log(title);
//   // create quiz
//   const quiz = new Quiz({
//     title,
//   });
//
//   // validate quiz
//   quiz.validate((e) => {
//     console.log(e);
//   });
//
//   // get tags
//   const tags = templateInstance.state.get('tags');
//   const tagsId = tags.map((t) => {
//     // check if tag exists
//     const newTag = { name: t.name };
//     const existTag = Tag.findOne(newTag); // TODO: better duplication checks
//     return existTag ? existTag._id : new Tag(newTag).save();
//   });
// };
>>>>>>> 858aca37fcf7c5519d44014c713b206df47be20c
