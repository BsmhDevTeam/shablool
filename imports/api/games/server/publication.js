import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
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
Meteor.publish('games.get-by-code', function(code) {
  check(code, String);
  return Game.find({ code });
});

Meteor.publish('games.open', function() {
  const games = Game.find(
    {
      gameLog: { $not: { $elemMatch: { nameType: eventTypes.GameClose } } },
    },
    { fields: { code: 1, 'quiz.owner': 1 } },
  );
  return games;
});
