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
    this.state = props.quiz;
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
