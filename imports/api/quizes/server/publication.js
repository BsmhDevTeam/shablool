import { Meteor } from 'meteor/meteor';
import Quiz from '../quizes.js';

Meteor.publish('quizes.my-quizes', function() {
  return Quiz.find({ owner: this.userId });
});

Meteor.publish('quizes.get', function(id) {
  return Quiz.find(id);
});

Meteor.publish('quizes.search', function(query) {
  return Quiz.find({
    $and: [
      { title: { $regex: query, $options: 'i' } },
      { $or: [{ owner: this.userId }, { private: false }] },
    ],
  });
});
