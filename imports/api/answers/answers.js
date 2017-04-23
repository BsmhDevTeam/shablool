import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

const Answers = new Mongo.Collection('answers');

export const Answer = Class.create({
  name: 'Answer',
  collection: Answers,
  fields: {
    text: {
      type:String,
      validators: [{
        type: 'minLength',
        param: 3
      }, {
        type: 'maxLength',
        param: 300
      }]
    }
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