import { Meteor } from 'meteor/meteor';

Meteor.publish('games.all', function() {
  return Game.find();
});

Meteor.publish('games.get', function(id) {
  return Game.find(id);
});

Meteor.publish('games.get-by-code', function(code) {
  return Game.find({ code });
});

Meteor.publish('games.games-managed', function() {
  return Game.find({ 'quiz.owner': this.userId });
});

Meteor.publish('games.games-played', function() {
  const games = Game.find({ gameLog: { $elemMatch: { playerId: this.userId } } });
  return games;
});
