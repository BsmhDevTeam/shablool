import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Factory } from 'meteor/dburles:factory';
import { GameInit } from '../games/games';

const GameLog = Class.create({
  name: 'GameLog',
  collection: new Mongo.Collection('gamelogs'),
  fields: {
    gameId: {
      type: String,
    },
    event: {
      type: Object,
    },
  },
});

export default GameLog;

Factory.define('gamelog', GameLog, {
  gameId: () => '123456',
});

Factory.define('gamelog with GameInit', GameLog, {
  event: () => new GameInit(),
});
