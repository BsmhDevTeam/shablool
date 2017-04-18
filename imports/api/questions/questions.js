import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Answer } from '../answers/answers.js'

const Questions = new Mongo.Collection('questions');

export const Question = Class.create({
  name: 'Question',
  collection: Questions,
  fields: {
    text: String,
    answers: [Answer],
    order: Number,
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