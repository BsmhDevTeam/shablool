import { Template } from 'meteor/templating';

import './management.html';
import '../../components/my-quiz/my-quiz.js';
import Quiz from '../../../api/quizes/quizes';

Template.management.onCreated(function() {
  this.autorun(() => {
    this.subscribe('quizes.myQuizes');
  });
});

Template.management.helpers({
  myQuizes() {
    return Quiz.find();
  },

  deleteQuiz(quiz) {
    return () => () => quiz.delete();
  },
});
