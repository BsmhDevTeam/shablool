import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Game from '../../games/games.js';

Meteor.publish('users.names', function() {
  return Meteor.users.find({}, { fields: { 'services.gitlab.username': 1 } });
});

Meteor.publish('users.my-name', function() {
  return Meteor.users.find({ _id: this.userId }, { fields: { 'services.gitlab.username': 1 } });
});

Meteor.publish('users.name.by-game', function(code) {
  check(code, String);
  this.autorun(function() {
    const game = Game.findOne({ code });
    return Meteor.users.find(
      { _id: { $in: (game && game.getPlayersId()) || [] } },
      { fields: { 'services.gitlab.username': 1 } },
    );
  });
});
