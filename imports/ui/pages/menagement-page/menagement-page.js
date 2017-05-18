import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './menagement-page.html';
import Quiz from '../../../api/quizes/quizes';

Template.menagementPage.onCreated(function() {
  Template.instance().subscribe('quiz-title');
  this.state = new ReactiveDict();
  this.state.setDefault({
    quizes: Quiz.find(),
  });
});

Template.menagementPage.helpers({
  getQuizes() {
    return Quiz.find();
  },

  deleteQuiz(quiz) {
    Quiz.remove(quiz);
  },
});

Template.menagementPage.events({
  'click .delete': function() {
    return this.delete();
  },
});
