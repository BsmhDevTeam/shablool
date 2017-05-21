import { Meteor } from 'meteor/meteor';
import Quize from '../quizes.js';

Meteor.publish('quizes.myQuizes', function() {
  // TODO: filter only my quizes
  return Quize.find();
});

Meteor.publish('quizes.get', function(id) {
  return Quize.find(id);
});
