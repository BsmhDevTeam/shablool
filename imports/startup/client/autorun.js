import { QuizesIndex } from '../../api/quizes/quizes.js';

Tracker.autorun(() => {
  console.log(QuizesIndex.search('a', { limit: 20 }).fetch());
});