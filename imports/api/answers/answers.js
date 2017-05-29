import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

const Answers = new Mongo.Collection('answers');

export default Class.create({
  name: 'Answer',
  collection: Answers,
  fields: {
    text: {
      type: String,
      validators: [
        {
          type: 'minLength',
          param: 1,
          message: 'חובה למלא תשובה',
        },
        {
          type: 'maxLength',
          param: 300,
          message: 'תשובה ארוכה מידי',
        },
        {
          type: 'regexp',
          param: /^.*\S.*$/,
          message: 'תכניס תשובה נורמלית!',
        },
      ],
    },
    points: {
      type: Number,
      default: 0,
    },
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
