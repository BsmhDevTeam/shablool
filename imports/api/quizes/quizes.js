import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Question } from '../api/questions/questions.js';

export const Quizes = new Mongo.Collection('quizes');

const Quize = Class.create({
  name: 'Quize',
  collection: Quizes,
  fields: {
    name: String,
    tags: [String],
    user: String,
    questions: [Question],
    private: {
    	value: Boolean,
    	default: false
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