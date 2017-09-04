import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { check } from 'meteor/check';
import Image from '/imports/api/images/images.js';
import Quiz from '../quizes.js';

// Owner publications :
publishComposite('quizes.my-quizes', function() {
  return {
    find() {
      return Quiz.find({ owner: this.userId });
    },
    children: [
      {
        find(quiz) {
          return Image.find({ _id: { $in: quiz.getImagesId() } });
        },
      },
    ],
  };
});

// Public/Owner publications :
publishComposite('quizes.get', function(id) {
  return {
    find() {
      check(id, String);
      return Quiz.find({
        $and: [
          { _id: id },
          { $or: [{ owner: this.userId }, { private: false }] },
        ],
      });
    },
    children: [
      {
        find(quiz) {
          return Image.find({ _id: { $in: quiz.getImagesId() } });
        },
      },
    ],
  };
});

publishComposite('quizes.search', function(query) {
  return {
    find() {
      check(query, String);
      return Quiz.find({
        $and: [
          { title: { $regex: query, $options: 'i' } },
          { $or: [{ owner: this.userId }, { private: false }] },
        ],
      });
    },
    children: [
      {
        find(quiz) {
          return Meteor.users.find(
            { _id: quiz.owner },
            { fields: { 'services.gitlab.username': 1 } },
          );
        },
      },
    ],
  };
});
