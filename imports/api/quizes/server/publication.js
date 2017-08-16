import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Quiz from '../quizes.js';

// Owner publications :
Meteor.publish('quizes.my-quizes', function() {
  return Quiz.find({ owner: this.userId });
});

// Public/Owner publications :
Meteor.publish('quizes.get', function(id) {
  check(id, String);
  return Quiz.find({
    $and: [{ _id: id }, { $or: [{ owner: this.userId }, { private: false }] }],
  });
});

Meteor.publish('quizes.search', function(query) {
  check(query, String);
  return Quiz.find({
    $and: [
      { title: { $regex: query, $options: 'i' } },
      { $or: [{ owner: this.userId }, { private: false }] },
    ],
  });
});
