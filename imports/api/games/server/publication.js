import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { eventTypes } from '/imports/startup/both/constants';
import Game from '../games.js';

// Manager publications :
publishComposite('games.games-managed', function() {
  return {
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
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'services.gitlab.username': 1 } },
          );
        },
      },
    ],
  };
});

// Player publications :
publishComposite('games.games-played', function() {
  return {
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
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'services.gitlab.username': 1 } },
          );
        },
      },
    ],
  };
});

// Both :
publishComposite('games.get-by-code.without-points', function(code) {
  return {
    find() {
      return Game.find({ code }, { fields: { 'quiz.questions.answers.points': 0 } }); // Limit publication need-to-know only' player and Manager
    },
    children: [
      {
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'services.gitlab.username': 1 } },
          );
        },
      },
    ],
  };
});

publishComposite('games.get-by-code', function(code) {
  return {
    find() {
      return Game.find({ code }); // Limit publication need-to-know only' player and Manager
    },
    children: [
      {
        find(game) {
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(), game.quiz.owner] } },
            { fields: { 'services.gitlab.username': 1 } },
          );
        },
      },
    ],
  };
});
