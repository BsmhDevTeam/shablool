import { Meteor } from 'meteor/meteor';
import Game from '../games.js';

Meteor.publish('games.all', () => {
  Game.find();
});

Meteor.publish('games.get', (id) => {
  Game.find(id);
});
