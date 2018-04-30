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
      }).map(o => o._id);
      return GameLog.find({
        $and: [
          { _id: { $in: gamesPlayedId } },
          { 'event.nameType': eventTypes.GameClose },
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
          }).map(o => o._id);
          const gamePlayedAndClosed = GameLog.find({
            $and: [
              { _id: { $in: gamesPlayedId } },
              { 'event.nameType': eventTypes.GameClose },
            ],
          });
          const playersId = gamePlayedAndClosed.map(o => o.event.playerId);
          return Meteor.users.find(
            { _id: { $in: [...playersId] } },
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
          }).map(o => o._id);
          const gamePlayedAndClosed = GameLog.find({
            $and: [
              { _id: { $in: gamesPlayedId } },
              { 'event.nameType': eventTypes.GameClose },
            ],
          });
          return Game.find({ _id: { $in: gamePlayedAndClosed } });
        },
      },
    ],
  };
});
