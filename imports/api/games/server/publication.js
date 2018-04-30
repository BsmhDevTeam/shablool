import { publishComposite } from 'meteor/reywood:publish-composite';
import { eventTypes } from '/imports/startup/both/constants';
import Image from '/imports/api/images/images.js';
import Game from '../games.js';
import GameLog from '../../gamelogs/gamelogs';


// Manager publications :
publishComposite('games.games-managed', function() {
  return {
    collectionName: 'games',
    find() {
      const userId = this.userId;
      const myGamesId = Game.find({ 'quiz.owner': userId }).map(o => o._id);
      console.log('myGamesId:', myGamesId);
      const myGamesClosedId = GameLog.find({
        $and: [
          { gameId: { $in: myGamesId } },
          { 'event.nameType': eventTypes.GameClose },
        ],
      }).map(o => o.gameId);
      console.log('myGamesClosedId:', myGamesClosedId);
      return Game.find({ _id: { $in: myGamesClosedId } });
    },
    children: [
      {
        collectionName: 'gamelogs',
        find(game) {
          return GameLog.find({ gameId: game._id });
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
      const myGamesRegiteredId = GameLog.find({ 'event.playerId': this.userId })
      .fetch().map(o => o.gameId);
      const myGamesRegiteredColsedId = GameLog.find({ gameId: { $in: myGamesRegiteredId },
        'event.nameType': eventTypes.GameClose }).fetch();
      return Game.find({ _id: { $in: myGamesRegiteredColsedId } });
    },
    children: [
      {
        collectionName: 'gamelogs',
        find(game) {
          return GameLog.find({ gameId: game._id });
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
      const myGamesRegiteredId = GameLog.find({ 'event.playerId': this.userId })
      .map(o => o.gameId);
      // TODO: check if game is open
      return Game.find({
        $and: [
          { code },
          {
            $or: [
              { 'quiz.owner': this.userId },
              { _id: { $in: myGamesRegiteredId } },
            ],
          },
        ],
      }); // TODO: Limit publication need-to-know only' player and Manager
    },
    children: [
      {
        collectionName: 'images',
        find(game) {
          const gameLog = GameLog.find({ gameId: game._id }).map(o => o.event);
          return Image.find({ _id: { $in: game.getImagesId(gameLog) } });
        },
      },
      {
        collectionName: 'gamelogs',
        find(game) {
          return GameLog.find({ gameId: game._id });
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
