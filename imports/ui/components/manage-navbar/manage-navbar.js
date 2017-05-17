import './manage-navbar.html';

import { Template } from 'meteor/templating';
import { EasySearch } from 'meteor/easy:search';

import { Quizes } from '../../../api/quizes/quizes.js';
import { QuizesIndex } from '../../../api/quizes/quizes-index.js';

Template.manageNavbar.helpers({
  quizesIndex: () => QuizesIndex,
});