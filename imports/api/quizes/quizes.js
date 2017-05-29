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
    owner: String, // read about authentication
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
    forkQuiz: () => {
      const quiz = new Quizes(this);
      quiz.save();
    },
  },

  helpers: {
    getTags() {
      return Tag.find({ _id: { $in: this.tags } });
    },
  },
});
