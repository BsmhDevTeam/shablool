import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

export const Groups = new Mongo.Collection('groups');

const Group = Class.create({
  name: 'Group',
  collection: Groups,
  fields: {
    userId: Number,
    gameId: Number,
    points: Number,
    createdAt: {
      value: Date,
      default: Date.Now()
    },
    lastUpdate: {
      value: Date,
      default: Date.Now()
    }
  },
});