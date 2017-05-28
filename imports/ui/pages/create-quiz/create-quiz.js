import React from 'react';
import uuidV4 from 'uuid/v4';
import Quiz from '../../../api/quizes/quizes.js';
import Question from '../../../api/questions/questions.js';
import Answer from '../../../api/answers/answers.js';
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
      quiz: {
        title: '',
        questions: [newQuestion()],
        tags: [],
        owner: 'Me',
        private: false,
      },
      validations: {},
    };
  }

  render() {
    const changeQuizTitle = (e) => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, title: e.target.value };
      this.setState({ quiz: quiz$ });
    };

    const addQuestion = () => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, questions: [...quiz.questions, newQuestion()] };
      this.setState({ quiz: quiz$ });
    };

    const removeQuestion = id => () => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, questions: quiz.questions.filter(q => q._id !== id) };
      this.setState({ quiz: quiz$ });
    };

    const addTag = (e) => {
      e.preventDefault();

      // get args
      const form = e.target;
      const tagName = form.tag.value;

      // create new tag
      const newTag = {
        _id: uuidV4(),
        name: normalizeTagName(tagName),
      };

      // update state
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, tags: [...quiz.tags, newTag] };
      this.setState({ quiz: quiz$ });

      // clear form
      form.tag.value = '';
    };

    const removeTag = id => () => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, tags: quiz.tags.filter(t => t._id !== id) };
      this.setState({ quiz: quiz$ });
    };

    const changeQuestionText = id => (e) => {
      const quiz = this.state.quiz;
      const text$ = e.target.value;
      const questions$ = quiz.questions.map(q => (q._id !== id ? q : { ...q, text: text$ }));
      const quiz$ = { ...quiz, questions: questions$ };
      this.setState({ quiz: quiz$ });
    };

    const changeQuestionTime = id => (e) => {
      const quiz = this.state.quiz;
      const time$ = e.target.value;
      const questions$ = quiz.questions.map(q => (q._id !== id ? q : { ...q, time: time$ }));
      const quiz$ = { ...quiz, questions: questions$ };
      this.setState({ quiz: quiz$ });
    };

    const changeAnswerText = qId => aId => (e) => {
      const quiz = this.state.quiz;
      const text$ = e.target.value;
      const answers$ = quiz.questions
        .find(q => q._id === qId)
        .answers.map(a => (a._id !== aId ? a : { ...a, text: text$ }));
      const questions$ = quiz.questions.map(q => (q._id !== qId ? q : { ...q, answers: answers$ }));
      const quiz$ = { ...quiz, questions: questions$ };
      this.setState({ quiz: quiz$ });
    };

    const changeAnswerPoints = qId => aId => (e) => {
      const quiz = this.state.quiz;
      const points$ = e.target.value;
      const answers$ = quiz.questions
        .find(q => q._id === qId)
        .answers.map(a => (a._id !== aId ? a : { ...a, points: points$ }));
      const questions$ = quiz.questions.map(q => (q._id !== qId ? q : { ...q, answers: answers$ }));
      const quiz$ = { ...quiz, questions: questions$ };
      this.setState({ quiz: quiz$ });
    };

    const saveQuiz = (e) => {
      e.preventDefault();

      const questions = this.state.quiz.questions.map((q) => {
        let qValidations = {};
        // compute questions validaitons
        const q$ = new Question(q);
        q$.validate((err) => {
          qValidations = err.details.reduce((v, d) => {
            const v$ = { ...v };
            v$[d.name] = d.message;
            return v$;
          }, {});
        });
        const answers = q.answers.map((a) => {
          let aValidations = {};
          // compute answers validations
          const a$ = new Answer(a);
          a$.validate((err) => {
            aValidations = err.details.reduce((v, d) => {
              const v$ = { ...v };
              v$[d.name] = d.message;
              return v$;
            }, {});
          });
          return aValidations;
        });
        qValidations = { ...qValidations, answers };
        return qValidations;
      });

      // compute quiz validations
      const quiz = new Quiz(this.state.quiz);
      quiz.validate((err) => {
        const quizValidations = err.details.reduce((v, d) => {
          const v$ = { ...v };
          v$[d.name] = d.message;
          return v$;
        }, {});
        const validations = { ...quizValidations, questions };
        console.log(validations);
        // Check Validations and submit
        this.setState({ validations });
      });

      // Save Quiz
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
      saveQuiz,
    };

    return (
      <QuizForm quiz={this.state.quiz} validations={this.state.validations} actions={actions} />
    );
  }
}

// TODO: CODE TO CONVERT

// validations.filter(v => new RegExp(`questions.${i}`).test(v))

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
