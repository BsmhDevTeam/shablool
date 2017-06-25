import React from 'react';
import { Meteor } from 'meteor/meteor';
import uuidV4 from 'uuid/v4';
import Quiz from '../../../api/quizes/quizes.js';
import Tag from '../../../api/tags/tags.js';
import QuizForm from '../../components/quiz-form.js';

// Utilities
const newQuestion = () => {
  const answers = [1, 2, 3, 4].map(i => ({
    _id: uuidV4(),
    text: '',
    order: i,
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
class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {
        title: '',
        questions: [newQuestion()],
        tags: [],
        owner: Meteor.userId(),
        private: false,
      },
      validate: false,
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
      const quiz$ = {
        ...quiz,
        questions: quiz.questions.filter(q => q._id !== id),
      };
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

    const addTag = (e) => {
      e.preventDefault();

      // get args
      const form = e.target;
      const tagName = form.tag.value;

      // clear form
      form.tag.value = '';

      // create new tag
      const newTag = {
        _id: uuidV4(),
        name: normalizeTagName(tagName),
      };

      // update state
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, tags: [...quiz.tags, newTag] };
      return quiz.tags.find(t => t.name === tagName) ? 'Nothing' : this.setState({ quiz: quiz$ });
    };

    const removeTag = id => () => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, tags: quiz.tags.filter(t => t._id !== id) };
      this.setState({ quiz: quiz$ });
    };

    const changeQuizPrivacy = (e) => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, private: e.target.value };
      this.setState({ quiz: quiz$ });
    };

    const saveQuiz = (e) => {
      e.preventDefault();
      if (!this.state.validate) this.setState({ validate: true });
      // Save Quiz
      const quiz = this.state.quiz;
      const tags = quiz.tags.map((t) => {
        const tag = Tag.findOne({ name: t.name });
        return tag ? tag._id : new Tag(t).create();
      });
      const questions = quiz.questions.map((q, i) => ({ ...q, order: i + 1 }));
      const quiz$ = new Quiz({ ...quiz, questions, tags, owner: Meteor.userId() }, { cast: true });
      quiz$.create();
    };

    const actions = {
      changeQuizTitle,
      changeQuizPrivacy,
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
      <div id="create-quiz">
        <QuizForm quiz={this.state.quiz} validate={this.state.validate} actions={actions} />
      </div>
    );
  }
}

export default CreateQuiz;
