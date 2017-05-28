import React from 'react';
import QuizCard from '../../components/quiz-card/quiz-card.js';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import Quiz from '/imports/api/quizes/quizes.js';
import { createContainer } from 'meteor/react-meteor-data';

const Search = (props) => (
  <div>
    <ul>
      {props.results.map(quiz => (
        <div>
          <QuizCard quiz={ quiz } />
        </div>
      ))}
    </ul>
  </div>
);

const SearchContainer = ({ loading, query }) => {
  console.log(loading);
  if (loading) return <p>loading</p>;
  const results = Quiz.find({});
  return <Search results={results} />;
};

export default createContainer(({ query }) => {
  const searchHandle = Meteor.subscribe('quizes.search', query);
  const loading = !searchHandle.ready();
  return {
    loading,
    query,
  };
}, SearchContainer);
