import { Template } from 'meteor/templating';
import { EasySearch } from 'meteor/easy:search';

import './search-results.html';
import '../../components/quiz-card/quiz-card.js';
import '../../components/manage-navbar/manage-navbar.js';
import { QuizesIndex } from '../../../api/quizes/quizes-index.js';


Template.searchResults.helpers({
  quizesIndex: () => QuizesIndex,
});
