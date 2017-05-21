import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Quiz from '/imports/api/quizes/quizes.js';

import './search.html';
import '../../components/manage-navbar/manage-navbar.js';
import '../../components/quiz-card/quiz-card.js';

Template.Search.onCreated(function() {
  // state from url
  this.getQuery = () => FlowRouter.getParam('query');
  // subscriptions
  this.autorun(() => {
    this.subscribe('quizes.search', this.getQuery());
  });
});

Template.Search.helpers({
  results() {
    const query = Template.instance().getQuery();
    return Quiz.find({});
  },
});
