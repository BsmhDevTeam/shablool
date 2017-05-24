import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Users } from '../api/users/users.js';

export const Groups = new Mongo.Collection('groups');

const Group = Class.create({
  name: 'Group',
  collection: Groups,
  fields: {
    name: {
      type:String,
      validators: [{
        type: 'minLength',
        param: 3,
      }, {
        type: 'maxLength',
        param: 40
      }]
    },
    users: Users,
    createdAt: {
      value: Date,
      default: Date.Now(),
    },
    lastUpdate: {
      value: Date,
      default: Date.Now(),
    },
  },
});