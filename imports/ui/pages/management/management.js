import { Template } from 'meteor/templating';

import './management.html';
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
});
