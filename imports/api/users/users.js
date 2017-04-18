import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

export const Users = new Mongo.Collection('users');

const User = Class.create({
  name: 'User',
  collection: Users,
  fields: {
    name: String,
    soldierId: String,
	createdAt: Date,
    lastUpdate: Date
  },
});