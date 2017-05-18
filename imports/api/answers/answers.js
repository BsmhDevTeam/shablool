import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

const Answers = new Mongo.Collection('answers');

export default Class.create({
  name: 'Answer',
  collection: Answers,
  fields: {
    text: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 1,
      }, {
        type: 'maxLength',
        param: 300,
      }],
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
