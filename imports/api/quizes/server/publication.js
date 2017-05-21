import { Meteor } from 'meteor/meteor';
import Quiz from '../quizes.js';

Meteor.publish('quiz-title', function() {
  return Quiz.find({}, { fields: { title: true } });
});

Meteor.publish('quizes.myQuizes', function() {
  // TODO: filter only my quizes
  return Quiz.find();
});

Meteor.publish('quizes.get', function(id) {
  return Quiz.find(id);
});

Meteor.publish('quizes.search', function(query) {
  return Quiz.find({
    $or: [
      {
        title: {
          $regex: query,
          $options: 'i',
        },
      },
    ],
  });
});
