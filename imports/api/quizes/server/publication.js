import { Meteor } from 'meteor/meteor';
import Quiz from '../quizes.js';

Meteor.publish('quizes.titlesOnly', function() {
  // TODO: filter private quizes
  return Quiz.find({}, { fields: { title: true } });
});

Meteor.publish('quizes.myQuizes', function() {
  // TODO: filter only my quizes
  return Quiz.find();
});

Meteor.publish('quizes.all', function() {
  // TODO: filter only my quizes
  return Quiz.find();
});

Meteor.publish('quizes.get', function(id) {
  // TODO: check quiz ownership
  return Quiz.find(id);
});

Meteor.publish('quizes.search', function(query) {
  // TODO: filter private quizes
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
