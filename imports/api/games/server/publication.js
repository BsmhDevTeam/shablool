import { Meteor } from 'meteor/meteor';
import Game, { eventTypes } from '../games.js';


Meteor.publish('games.get-by-code', function(code) {
  return Game.find({ code });
});

Meteor.publish('games.games-managed', function() {
  return Game.find({ 'quiz.owner': this.userId });
});

Meteor.publish('games.games-played', function() {
  const games = Game.find({
    gameLog: { $elemMatch: { playerId: this.userId } },
  });
  return games;
});

Meteor.publish('games.open', function() {
  const games = Game.find(
    {
      gameLog: { $not: { $elemMatch: { nameType: eventTypes.GameClose } } },
    },
    { fields: { code: 1 } },
  );
  return games;
});
