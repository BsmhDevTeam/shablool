import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Quiz from '/imports/api/quizes/quizes.js';

import ManageNavbar from '../../components/manage-navbar/manage-navbar.js';
import { QuizCard } from '../../components/quiz-card/quiz-card.js';

const Search = () => (
  <ManageNavbar />
  <ul>
    {results.map(result => (
      <div>
        <QuizCard title= { result.title } user={ result.user } tags={ result.tags } />
      </div>
    ))}
  </ul>
);

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

export default Search;
