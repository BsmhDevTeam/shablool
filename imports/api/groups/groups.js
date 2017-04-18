import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Users } from '../api/users/users.js';

export const Groups = new Mongo.Collection('groups');

const Group = Class.create({
  name: 'Group',
  collection: Groups,
  fields: {
    name: String,
    users: Users,
    createdAt: Date,
    lastUpdate: Date
  },
});