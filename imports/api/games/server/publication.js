import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { eventTypes } from '/imports/startup/both/constants';
import Image from '/imports/api/images/images.js';
import Game from '../games.js';


// Manager publications :
publishComposite('games.games-managed', function() {
  return {
    collectionName: 'games',
    find() {
      const userId = this.userId;
      return Game.find({
        $and: [
          { 'quiz.owner': userId },
          { gameLog: { $elemMatch: { nameType: eventTypes.GameClose } } },
        ],
      });
    },
    children: [
      {
        collectionName: 'users',
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'username': 1 } },
          );
        },
      },
    ],
  };
});

// Player publications :
publishComposite('games.games-played', function() {
  return {
    collectionName: 'games',
    find() {
      return Game.find({
        $and: [
          { gameLog: { $elemMatch: { playerId: this.userId } } },
          { gameLog: { $elemMatch: { nameType: eventTypes.GameClose } } },
        ],
      });
    },
    children: [
      {
        collectionName: 'users',
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'username': 1 } },
          );
        },
      },
    ],
  };
});

// Both :
publishComposite('games.get-by-code', function(code) {
  return {
    collectionName: 'games',
    find() {
      return Game.find({
        $and: [
          { code },
          {
            $or: [
              { 'quiz.owner': this.userId },
              { gameLog: { $elemMatch: { playerId: this.userId } } },
            ],
          },
        ],
      }); // TODO: Limit publication need-to-know only' player and Manager
    },
    children: [
      {
        collectionName: 'users',
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'username': 1 } },
          );
        },
      },
      {
        collectionName: 'images',
        find(game) {
          return Image.find({ _id: { $in: game.getImagesId() } });
        },
      },
    ],
  };
});

/*
publishComposite('games.get-by-code.without-points', function(code) {
  return {
    find() {
      // TODO: Limit publication need-to-know only' player and Manager
      return Game.find({ code }, { fields: { 'quiz.questions.answers.points': 0 } });
    },
    children: [
      {
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'username': 1 } },
          );
        },
      },
    ],
  };
});

publishComposite('games.get-by-code.by-question', function(code, questionId) {
  return {
    find() {
      return Game.aggregate([
        {
          $project: {
            'quiz.questions': {
              $filter: {
                input: '$quiz.questions',
                as: 'qu',
                cond: {
                  $eq: ['$$qu._id', questionId],
                },
              },
            },
          },
        },
      ]);
    },
    children: [
      {
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'username': 1 } },
          );
        },
      },
    ],
  };
});

publishComposite('games.get-by-code.by-question.without-points', function(code, questionId) {
  return {
    find() {
      return Game.aggregate([
        {
          $project: {
            'quiz.questions': {
              $filter: {
                input: '$quiz.questions',
                as: 'qu',
                cond: {
                  $eq: ['$$qu._id', questionId],
                },
              },
            },
          },
        },
        {
          $project: {
            'questions.answers.points': 0,
          },
        },
      ]);
    },
    children: [
      {
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'username': 1 } },
          );
        },
      },
    ],
  };
});
*/
