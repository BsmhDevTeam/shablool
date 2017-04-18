import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

const Answers = new Mongo.Collection('answers');

export const Answer = Class.create({
  name: 'Answer',
  collection: Answers,
  fields: {
    text: String,
    points: {
      value: Number,
      default: 0
    }
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