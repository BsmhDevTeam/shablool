import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Answer } from '../answers/answers.js';

const Questions = new Mongo.Collection('questions');

export default Class.create({
  name: 'Question',
  collection: Questions,
  fields: {
    text: {
      type: String,
      validators: [
        {
          type: 'minLength',
          param: 3,
          message: 'שאל שאלה נורמלית!',
        },
        {
          type: 'maxLength',
          param: 300,
          message: 'טוב נו מה אתה מגזים?! קצר קצת',
        },
      ],
    },
    answers: [Answer],
    order: Number,
    time: Number,
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
    lastUpdate: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});
