import { Index, MongoDBEngine } from 'meteor/easy:search';
import { Quizes } from './quizes.js';

export const QuizesIndex = new Index({
  collection: Quizes,
  fields: ['title'],
  engine: new MongoDBEngine(),
});

