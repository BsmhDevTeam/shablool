import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import PropTypes from 'prop-types';
import uuidV4 from 'uuid/v4';
import Quiz, { Question, Answer } from '/imports/api/quizes/quizes.js';
import QuizForm from '/imports/ui/components/quiz-form.js';
import Image from '/imports/api/images/images';
import Loading from '/imports/ui/components/loading.js';

// Utilities
const newQuestion = () => {
  const answers = [1, 2, 3, 4].map(i => (new Answer({ _id: uuidV4(), order: i })));
  const question = new Question({ _id: uuidV4(), answers });
  return question;
};

const normalizeTagName = str =>
  [str].map(s => s.trim()).map(s => s.toLocaleLowerCase()).map(s => s.replace(/\s+/g, '-')).pop();

// React Page
class CreateQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: new Quiz({ questions: [newQuestion()], owner: Meteor.userId() }),
      currentUpload: false,
      uploads: [],
      uploadsCounter: false,
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

      // update state
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, tags: [...quiz.tags, normalizeTagName(tagName)] };
      return quiz.tags.find(t => t === normalizeTagName(tagName)) ? 'Nothing' : this.setState({ quiz: quiz$ });
    };

    const removeTag = tag => () => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, tags: quiz.tags.filter(t => t !== tag) };
      this.setState({ quiz: quiz$ });
    };

    const changeQuizPrivacy = (e) => {
      const quiz = this.state.quiz;
      const quiz$ = { ...quiz, private: e.target.value };
      this.setState({ quiz: quiz$ });
    };

    const getThis = () => this;

    const changeQuizImage = (images) => {
      const uploadFile = () => {
        const upload = Image.insert(
          {
            file: images[0],
            streams: 'dynamic',
            chunkSize: 'dynamic',
          },
          false,
        );
        upload.on('start', function() {
          getThis().setState({ currentUpload: this });
        });

        upload.on('end', function(error, fileObj) {
          const endUpload = () => {
            const quiz = getThis().state.quiz;
            const quiz$ = { ...quiz, image: fileObj._id };
            getThis().setState({ quiz: quiz$ });
          };
          !error ? endUpload() : null;
          getThis().setState({
            currentUpload: false,
            uploadsCounter: getThis().state.uploadsCounter - 1,
          });
        });

        const uploadAndQuizId = {
          upload,
          qId: this.state.quiz._id,
        };

        const uploads$ = this.state.uploads
          .filter(u => u.qId !== this.state.quiz._id)
          .concat(uploadAndQuizId);
        this.setState({ uploads: uploads$ });
      };
      const cancelUpload = () => {
        const uploads$ = this.state.uploads.filter(u => u.qId !== this.state.quiz._id);
        this.setState({ uploads: uploads$ });
      };
      return images && images[0] ? uploadFile() : cancelUpload();
    };

    const changeQuestionImage = (qId, images) => {
      const uploadFile = () => {
        const upload = Image.insert(
          {
            file: images[0],
            streams: 'dynamic',
            chunkSize: 'dynamic',
          },
          false,
        );
        upload.on('start', function() {
          getThis().setState({ currentUpload: this });
        });

        upload.on('end', function(error, fileObj) {
          const endUpload = () => {
            const quiz = getThis().state.quiz;
            const questions$ = quiz.questions.map(
              q => (q._id !== qId ? q : { ...q, image: fileObj._id }),
            );
            const quiz$ = { ...quiz, questions: questions$ };
            getThis().setState({ quiz: quiz$ });
          };
          !error ? endUpload() : null;
          getThis().setState({
            currentUpload: false,
            uploadsCounter: getThis().state.uploadsCounter - 1,
          });
        });

        const uploadAndQuestionId = {
          upload,
          qId,
        };

        const uploads$ = this.state.uploads.filter(u => u.qId !== qId).concat(uploadAndQuestionId);
        this.setState({ uploads: uploads$ });
      };
      const cancelUpload = () => {
        const uploads$ = this.state.uploads.filter(u => u.qId !== qId);
        this.setState({ uploads: uploads$ });
      };
      return images && images[0] ? uploadFile() : cancelUpload();
    };

    const saveQuiz = () => {
      const quiz = this.state.quiz;
      const questions = quiz.questions.map((q, i) => ({ ...q, order: i + 1 }));
      const quiz$ = new Quiz({ ...quiz, questions, owner: Meteor.userId() }, { cast: true });
      quiz$.applyMethod('create', [], (err, result) => result && FlowRouter.go('Manage.Home'));
    };

    const uploadImages = (e) => {
      e.preventDefault();
      if (!this.state.validate) this.setState({ validate: true });
      this.setState({ uploadsCounter: this.state.uploads.length });
      this.state.uploads.map(u => u.upload.start());
    };

    this.state.uploadsCounter === 0 ? saveQuiz() : null;

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
      uploadImages,
      changeQuizImage,
      changeQuestionImage,
    };

    return (
      <div id="create-quiz">
        <h1>צור שאלון חדש</h1>
        <QuizForm quiz={this.state.quiz} validate={this.state.validate} actions={actions} />
      </div>
    );
  }
}

export default CreateQuiz;
