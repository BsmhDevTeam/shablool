import { Template } from 'meteor/templating';

import './management.html';
import '../../components/my-quiz/my-quiz.js';
import Quiz from '../../../api/quizes/quizes';

Template.management.onCreated(function() {
  Template.instance().subscribe('quiz-all');
});

Template.management.helpers({
  getQuizes() {
    return Quiz.find();
  },

  deleteQuiz(quiz) {
    return () => () => quiz.delete();
  },
});
