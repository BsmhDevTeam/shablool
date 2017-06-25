import { Meteor } from 'meteor/meteor';
import Game from '../games.js';

Meteor.publish('games.all', function() {
  return Game.find();
});

Meteor.publish('games.get', function(id) {
  return Game.find(id);
});

Meteor.publish('games.getByCode', function(code) {
  return Game.find({ code });
});

Meteor.publish('games.games-played', function() {
  return Game.find({ 'quiz.owner': this.userId });
});

Meteor.publish('games.games-managed', function() {
  return Game.find({
    $where: () =>
      Game.gameLog
        .filter(e => e.nameType === Game.getEventTypes().PlayerReg)
        .find(e => e.playerId === this.userId),
  });
});
