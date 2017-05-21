import { Template } from 'meteor/templating';
import './my-quiz.html';

Template.myQuiz.events({
  'click .delete'() {
    this.deleteQuiz();
  },
});
