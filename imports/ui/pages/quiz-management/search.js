import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Quiz from '/imports/api/quizes/quizes.js';
import QuizCard from '../../components/quiz-card.js';
import Loading from '../../components/loading';

const Search = ({ results }) =>
  <div>
    <ul>
      {results.map(quiz =>
        <div key={quiz._id}>
          <QuizCard quiz={quiz} />
        </div>,
      )}
    </ul>
  </div>;

const NoResults = () =>
  <div className="row">
    <img className="col-md-6" src="/img/no-search-results.png" alt="No Search Results" />
    <img className="col-md-6" src="/img/no-search-results-text.png" alt="No Search Results" />
  </div>;

const SearchContainer = ({ loading }) => {
  if (loading) return <Loading />;
  const results = Quiz.find().fetch();
  return results.length === 0 ? <NoResults /> : <Search results={results} />;
};

export default createContainer(({ query = '' }) => {
  const searchHandle = Meteor.subscribe('quizes.search', query);
  const loading = !searchHandle.ready();
  return {
    loading,
  };
}, SearchContainer);
