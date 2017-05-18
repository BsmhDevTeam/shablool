import { Template } from 'meteor/templating';

import './management.html';
import Quiz from '../../../api/quizes/quizes';

Template.management.onCreated(function() {
  Template.instance().subscribe('quiz-title');
});

Template.management.helpers({
  getQuizes() {
    return Quiz.find();
  },
});
