import { Meteor } from 'meteor/meteor';
import Game from '../games.js';

Meteor.publish('games.all', () => Game.find());

Meteor.publish('games.get', id => Game.find(id));

Meteor.publish('games.getByCode', code => Game.find({ code })); // TODO: filter active games
