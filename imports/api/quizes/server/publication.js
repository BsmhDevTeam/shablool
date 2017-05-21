import { Meteor } from 'meteor/meteor';
import Quiz from '../quizes.js';

if (Meteor.isServer) {
  Meteor.publish('quiz-all', function() {
    return Quiz.find();
  });

  Meteor.publish('quiz-title', function() {
    return Quiz.find({}, { fields: { title: true } });
  });

  Meteor.publish('quiz-by-id', function(idFromRoute) {
    return Quiz.find({ _id: idFromRoute }, {});
  });
}

