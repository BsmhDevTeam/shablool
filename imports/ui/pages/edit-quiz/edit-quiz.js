import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import uuidV4 from 'uuid/v4';
import Quiz from '../../../api/quizes/quizes';
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
class EditQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: props.quiz,
      validations: {},
    };
  }

  render() {
    const s = this.state;

    const changeQuizTitle = (e) => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, title: e.target.value };
      this.setState({ quiz: quiz$ });
    };

    const addQuestion = () => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, questions: [...s.questions, newQuestion()] };
      this.setState({ quiz: quiz$ });
    };

    const removeQuestion = id => () => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, questions: s.questions.filter(q => q._id !== id) };
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
      const quiz$ = { ...quiz, tags: [...s.tags, newTag] };
      this.setState({ quiz: quiz$ });

      // clear form
      form.tag.value = '';
    };

    const removeTag = id => () => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, tags: s.tags.filter(t => t._id !== id) };
      this.setState({ quiz: quiz$ });
    };

    const changeQuestionText = id => (e) => {
      const text$ = e.target.value;
      const questions$ = s.questions.map(q => (q._id !== id ? q : { ...q, text: text$ }));
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, questions: questions$ };
      this.setState({ quiz: quiz$ });
    };

    const changeQuestionTime = id => (e) => {
      const time$ = e.target.value;
      const questions$ = s.questions.map(q => (q._id !== id ? q : { ...q, time: time$ }));
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, questions: questions$ };
      this.setState({ quiz: quiz$ });
    };

    const changeAnswerText = qId => aId => (e) => {
      const text$ = e.target.value;
      const answers$ = s.questions
        .find(q => q._id === qId)
        .answers.map(a => (a._id !== aId ? a : { ...a, text: text$ }));
      const questions$ = s.questions.map(q => (q._id !== qId ? q : { ...q, answers: answers$ }));
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, questions: questions$ };
      this.setState({ quiz: quiz$ });
    };

    const changeAnswerPoints = qId => aId => (e) => {
      const points$ = e.target.value;
      const answers$ = s.questions
        .find(q => q._id === qId)
        .answers.map(a => (a._id !== aId ? a : { ...a, points: points$ }));
      const questions$ = s.questions.map(q => (q._id !== qId ? q : { ...q, answers: answers$ }));
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, questions: questions$ };
      this.setState({ quiz: quiz$ });
    };

    const saveQuiz = (e) => {
      e.preventDefault();
      const quiz = new Quiz(s.quiz);
      // Validate
      quiz.validate((err) => {
        const validations = err.details.reduce((v, d) => {
          const v$ = { ...v };
          v$[d.name] = d.message;
          return v$;
        }, {});
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

    return <QuizForm quiz={s.quiz} validations={s.validations} actions={actions} />;
  }
}

const EditQuizContainer = ({ loading, quizId }) => {
  if (loading) return <p>loading</p>;
  const quiz = Quiz.findOne(quizId);
  return <EditQuiz quiz={{ ...quiz, tags: quiz.getTags().fetch() }} />;
};

export default createContainer(({ id }) => {
  Meteor.subscribe('tags.all');
  const quizHandle = Meteor.subscribe('quizes.get', id);
  const loading = !quizHandle.ready();
  return {
    loading,
    quizId: id,
  };
}, EditQuizContainer);
