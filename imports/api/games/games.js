import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Users } from '../users/users.js'

export const Questions = new Mongo.Collection('questions');

const Question = Class.create({
  name: 'Question',
  collection: Questions,
  fields: {
    quizId: Number,
    users: Users,
    state: Boolean,
    time: Number,
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