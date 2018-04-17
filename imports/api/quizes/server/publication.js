import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { Counts } from 'meteor/ros:publish-counts';
import { check } from 'meteor/check';
import Image from '/imports/api/images/images.js';
import Quiz from '../quizes.js';

// Owner publications :
publishComposite('quizes.my-quizes', function() {
  return {
    collectionName: 'quizes',
    find() {
      return Quiz.find({ owner: this.userId });
    },
    children: [
      {
        collectionName: 'images',
        find(quiz) {
          return Image.find({ _id: { $in: quiz.getImagesId() } });
        },
      },
    ],
  };
});

Meteor.publish('quizes.count', function(query) {
  check(query, String);
  Counts.publish(this, 'quizzes-counter', Quiz.find({
    $and: [
      { $or: [{ title: { $regex: query, $options: 'i' } },
      { tags: { $elemMatch: { $regex: query, $options: 'i' } } }] },
      { $or: [{ owner: this.userId }, { private: false }] },
    ],
  }), { fastCount: true });
});

// Public/Owner publications :
publishComposite('quizes.get', function(id) {
  return {
    collectionName: 'quizes',
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
        collectionName: 'images',
        find(quiz) {
          return Image.find({ _id: { $in: quiz.getImagesId() } });
        },
      },
    ],
  };
});

publishComposite('quizes.search', function(query, numOfQuizzes) {
  const numberOfQuizzes = parseInt(numOfQuizzes, 10);
  return {
    collectionName: 'quizes',
    find() {
      check(query, String);
      return Quiz.find({
        $and: [
          { $or: [{ title: { $regex: query, $options: 'i' } },
          { tags: { $elemMatch: { $regex: query, $options: 'i' } } }] },
          { $or: [{ owner: this.userId }, { private: false }] },
        ],
      }, { limit: numberOfQuizzes });
    },
    children: [
      {
        collectionName: 'users',
        find(quiz) {
          return Meteor.users.find(
            { _id: quiz.owner },
            { fields: { 'services.gitlab.username': 1 } },
          );
        },
      },
      {
        collectionName: 'images',
        find(quiz) {
          return Image.find({ _id: quiz.image });
        },
      },
    ],
  };
});
