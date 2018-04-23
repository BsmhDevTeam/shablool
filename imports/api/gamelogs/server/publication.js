import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import GameLog from '../gamelogs';
import Game from '../../games/games';

Meteor.publish('gamelogs.get-by-gameid', function(code) {
  // TODO: publish only to manager and players
  check(code, String);
  console.log('code: ', code);
  const game = Game.findOne({ code });
  console.log('game:', game);
  return GameLog.find({ gameId: { $eq: game._id } });
});
