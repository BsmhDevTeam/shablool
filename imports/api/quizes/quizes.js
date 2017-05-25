import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import Question from '../questions/questions';
import Tag from '../tags/tags.js';

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
    user: String, // read about authentication
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

  meteorMethods: {
    delete() {
      this.remove();
    },
  },

  helpers: {
    getTags() {
      return Tag.find({ _id: { $in: this.tags } });
    },
  },
});
