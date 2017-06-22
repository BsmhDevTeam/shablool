import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Quiz from '/imports/api/quizes/quizes.js';
import QuizCard from '../../components/quiz-card/quiz-card.js';
import Loading from '../../components/loading/loading';

const Search = ({ results }) => (
  <div>
    <ul>
      {results.map(quiz => (
        <div>
          <QuizCard quiz={quiz} />
        </div>
      ))}
    </ul>
  </div>
);

const SearchContainer = ({ loading }) => {
  if (loading) return <Loading />;
  const results = Quiz.find();
  return <Search results={results} />;
};

export default createContainer(({ query }) => {
  const searchHandle = Meteor.subscribe('quizes.search', query);
  const loading = !searchHandle.ready();
  return {
    loading,
  };
}, SearchContainer);
