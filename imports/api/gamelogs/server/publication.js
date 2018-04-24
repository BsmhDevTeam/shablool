import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import GameLog from '../gamelogs';
import Game from '../../games/games';

Meteor.publish('gamelogs.get-by-gameid', function(gameId) {
  // TODO: publish only to manager and players
  check(gameId, String);
  console.log('code: ', gameId);
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
  console.log('game:', game);
  return GameLog.find({ gameId: { $eq: game._id } });
});
