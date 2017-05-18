import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import Question from '../questions/questions';

export const Quizes = new Mongo.Collection('quizes');

export default Class.create({
  name: 'Quiz',
  collection: Quizes,
  fields: {
    title: {
      type: String,
      validators: [
        {
          type: 'minLength',
          param: 3,
        },
        {
          type: 'maxLength',
          param: 40,
        },
      ],
    },
    questions: [Question],
    tags: {
      type: [String],
      default() {
        return [];
      },
    },
    user: String, // read about authentication techniques
    private: {
      // read about authorization models
      type: Boolean,
      default: false,
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