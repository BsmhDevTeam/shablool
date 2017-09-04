import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import { range } from 'underscore';
import { noImage } from '/imports/startup/both/constants';

const Quizes = new Mongo.Collection('quizes');

const MIN_POINTS = -1000000;
const MAX_POINTS = 1000000;

export const Answer = Class.create({
  name: 'Answer',
  fields: {
    _id: {
      type: String,
    },
    text: {
      type: String,
      default: '',
      validators: [
        {
          type: 'minLength',
          param: 1,
          message: 'חובה למלא תשובה',
        },
        {
          type: 'maxLength',
          param: 61,
          message: 'תשובה ארוכה מדי',
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
      validators: [
        {
          type: 'gte',
          param: MIN_POINTS,
          message: 'כמות הנקדות המינימלית היא מינוס מיליון',
        },
        {
          type: 'lte',
          param: MAX_POINTS,
          message: 'כמות הנקדות המקסימלית היא מיליון',
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

export const Question = Class.create({
  name: 'Question',
  fields: {
    _id: {
      type: String,
    },
    text: {
      type: String,
      default: '',
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
    image: {
      type: String,
      default() {
        return noImage;
      },
    },
    time: {
      type: Number,
      default: 30,
      validators: [
        {
          type: 'gte',
          param: 5,
          message: 'מעט מדי זמן לשאלה',
        },
        {
          type: 'lte',
          param: 3600,
          message: 'מה? שעה שאלה??',
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

const Quiz = Class.create({
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
    questions: {
      type: [Question],
      validators: [
        {
          type: 'minLength',
          param: 1,
          message: 'אתה לא יכול ליצור שאלון בלי שאלות',
        },
      ],
    },
    image: {
      type: String,
      default() {
        return noImage;
      },
    },
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

  meteorMethods: {},

  helpers: {
    getImagesId() {
      return this.questions.map(q => q.image).concat(this.image).filter(e => e !== noImage);
    },
  },
});

export default Quiz;

const mockAnswer = order => (new Answer({
  _id: faker.random.uuid(),
  text: faker.lorem.sentence(3),
  points: faker.random.number(),
  order,
}));

const mockQuestion = order => (new Question({
  _id: faker.random.uuid(),
  text: faker.lorem.sentence(3),
  answers: range(1, 5).map(mockAnswer),
  time: faker.random.number({ min: 5, max: 45 }),
  order,
}));

Factory.define('quiz', Quiz, {
  title: () => faker.lorem.sentence(3),
  questions: () => range(1, 5).map(mockQuestion),
  tags: () => ['tag'],
  owner: () => 'owner',
});
