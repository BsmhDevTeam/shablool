import { Meteor } from 'meteor/meteor';
import Question from '../questions.js';

Meteor.publish('questions.all', () => {
  Question.find();
});

Meteor.publish('questions.get', (id) => {
  Question.find(id);
});
