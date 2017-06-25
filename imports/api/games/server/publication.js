import { Meteor } from 'meteor/meteor';
import Game from '../games.js';

Meteor.publish('games.all', () => Game.find());

Meteor.publish('games.get', id => Game.find(id));

Meteor.publish('games.getByCode', code => Game.find({ code, isOn: true })); // TODO: filter active games

Meteor.publish('games.games-i-played', function() {
  return Game.find({ 'quiz.owner': this.userId });
});
