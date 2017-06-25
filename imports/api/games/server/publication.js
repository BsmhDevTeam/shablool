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
