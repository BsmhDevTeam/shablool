import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

export const Users = new Mongo.Collection('users');

const User = Class.create({
  name: 'User',
  collection: Users,
  fields: {
    name: {
      type:String,
      validators: [{
        type: 'minLength',
        param: 3
      }, {
        type: 'maxLength',
        param: 40
      }]
    }
    soldierId: String,
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