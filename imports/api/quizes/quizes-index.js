import { Quizes } from './quizes.js';
import { Index, MongoDBEngine } from 'meteor/easy:search';

export const QuizesIndex = new Index({
  collection: Quizes,
  fields: ['title'],
  engine: new MongoDBEngine(),
});

