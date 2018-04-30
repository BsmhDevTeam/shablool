import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { eventTypes } from '/imports/startup/both/constants';
import GameLog from '../gamelogs';
import Game from '../../games/games';

publishComposite('gamelogs.get-by-gameid', function(gameId) {
  return {
    collectionName: 'gamelogs',
    find() {
      const myGamesRegiteredId = GameLog.find({ 'event.playerId': this.userId })
      .fetch().map(o => o.gameId);
      const game = Game.findOne({
        $and: [
          { _id: gameId },
          {
            $or: [
              { 'quiz.owner': this.userId },
              { _id: { $in: myGamesRegiteredId } },
            ],
          },
        ],
      });
      return GameLog.find({ gameId: { $eq: game._id } });
    },
    children: [
      {
        collectionName: 'users',
        find() {
          const game = Game.findOne({ _id: gameId });
          const gameLog = GameLog.find({ gameId: game._id }).map(o => o.event);
          return Meteor.users.find(
            { _id: { $in: [...game.getPlayersId(gameLog), game.quiz.owner] } },
            { fields: { username: 1 } },
          );
        },
      },
    ],
  };
});

publishComposite('gamelogs.get-games-played', function() {
  return {
    collectionName: 'gamelogs',
    find() {
      const gamesPlayedId = GameLog.find({
        $and: [
          { 'event.nameType': eventTypes.PlayerReg },
          { 'event.playerId': this.userId },
        ],
      }).map(o => o.gameId);
      const gamePlayedAndClosedId = GameLog.find({
        $and: [
          { gameId: { $in: gamesPlayedId } },
          { 'event.nameType': eventTypes.GameClose },
        ],
      }).map(o => o.gameId);
      return GameLog.find({
        $and: [
          { gameId: { $in: gamePlayedAndClosedId } },
        ],
      });
    },
    children: [
      {
        collectionName: 'users',
        find() {
          const gamesPlayedId = GameLog.find({
            $and: [
              { 'event.nameType': eventTypes.PlayerReg },
              { 'event.playerId': this.userId },
            ],
          }).map(o => o.gameId);
          const gamePlayedAndClosedId = GameLog.find({
            $and: [
              { gameId: { $in: gamesPlayedId } },
              { 'event.nameType': eventTypes.GameClose },
            ],
          }).map(o => o.gameId);
          const gamesPlayedAndClosed = GameLog.find({
            $and: [
              { gameId: { $in: gamePlayedAndClosedId } },
              { 'event.nameType': eventTypes.PlayerReg },
              { 'event.playerId': this.userId },
            ],
          });
          const playersId = gamesPlayedAndClosed.map(o => o.event.playerId);
          const gamelogsId = gamesPlayedAndClosed.map(o => o.gameId);
          const games = Game.find({ _id: { $in: gamelogsId } }).fetch();
          const gamesManagers = games.map(g => g.quiz.owner);
          return Meteor.users.find(
            { _id: { $in: [...playersId, ...gamesManagers] } },
            { fields: { username: 1 } },
          );
        },
      },
      {
        collectionName: 'games',
        find() {
          const gamesPlayedId = GameLog.find({
            $and: [
              { 'event.nameType': eventTypes.PlayerReg },
              { 'event.playerId': this.userId },
            ],
          }).map(o => o.gameId);
          const gamePlayedAndClosedId = GameLog.find({
            $and: [
              { gameId: { $in: gamesPlayedId } },
              { 'event.nameType': eventTypes.GameClose },
            ],
          }).map(o => o.gameId);
          return Game.find({ _id: { $in: gamePlayedAndClosedId } });
        },
      },
    ],
  };
});
