import { Template } from 'meteor/templating';
import './question-form.html';

Template.questionForm.events({
  'click .remove-question'() {
    this.removeQuestion();
  },
});
