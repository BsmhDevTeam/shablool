import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { eventTypes } from '/imports/startup/both/constants';
import Game from '../games.js';

// Manager publications :
Meteor.publish('games.games-managed', function() {
  const userId = this.userId;
  return Game.find({
    $and: [
      { 'quiz.owner': userId },
      { gameLog: { $elemMatch: { nameType: eventTypes.GameClose } } },
    ],
  });
});

// Player publications :
Meteor.publish('games.games-played', function() {
  const games = Game.find({
    $and: [
      { gameLog: { $elemMatch: { playerId: this.userId } } },
      { gameLog: { $elemMatch: { nameType: eventTypes.GameClose } } },
    ],
  });
  return games;
});

// Both :
publishComposite('games.get-by-code', function(code) {
  return {
    find() {
      return Game.find({ code });
    },
    children: [
      {
        find(game) {
          return Meteor.users.find(
            { _id: { $in: (game && game.getPlayersId()) || [] } },
            { fields: { 'services.gitlab.username': 1 } },
          );
        },
      },
    ],
  };
});
