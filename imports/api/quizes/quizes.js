import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import Tag from '../tags/tags.js';

const Quizes = new Mongo.Collection('quizes');

export const Answer = Class.create({
  name: 'Answer',
  fields: {
    _id: {
      type: String,
    },
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
          param: 30,
          message: 'תשובה ארוכה מידי',
        },
        {
          type: 'regexp',
          param: /^.*\S.*$/,
          message: 'תכניס תשובה נורמלית!',
        },
      ],
    },
    order: Number,
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

export const Question = Class.create({
  name: 'Question',
  fields: {
    _id: {
      type: String,
    },
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
          param: 150,
          message: 'טוב נו מה אתה מגזים?! קצר קצת',
        },
      ],
    },
    answers: [Answer],
    order: Number,
    time: {
      type: Number,
      validators: [
        {
          type: 'gte',
          param: 5,
          message: 'מעט מידי זמן לשאלה',
        },
      ],
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
          message: 'תן כותרת נורמלית!',
        },
        {
          type: 'maxLength',
          param: 40,
          message: 'טוב נו מה אתה מגזים?! קצר קצת',
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
    owner: String,
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
    create() {
      return this.save();
    },
    update(fields) {
      this.set(fields);
      this.lastUpdated = new Date();
      return this.save();
    },
    delete() {
      return this.remove();
    },
  },

  helpers: {
    getTags() {
      return Tag.find({ _id: { $in: this.tags } });
    },
  },
});
