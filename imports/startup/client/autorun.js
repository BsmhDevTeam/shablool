import { Tracker } from 'meteor/tracker';
import { QuizesIndex } from '../../api/quizes/quizes-index.js';


Tracker.autorun(() => {
  console.log(QuizesIndex.search('a', { limit: 20 }).fetch());
});
