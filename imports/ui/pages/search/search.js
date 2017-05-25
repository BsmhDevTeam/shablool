
import React from 'react';
import ManageNavbar from '../../components/manage-navbar/manage-navbar.js';
import QuizCard from '../../components/quiz-card/quiz-card.js';

const Search = () => (
  <div>
    <ManageNavbar />
    <ul>
      {results.map(result => (
        <div>
          <QuizCard title={result.title} user={result.user} tags={result.tags} />
        </div>
      ))}
    </ul>
  </div>
);

export default Search;
