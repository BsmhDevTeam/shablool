import React from 'react';
import { Meteor } from 'meteor/meteor';
import Game from '/imports/api/games/games';

const QuizCard = ({ quiz }) => {
  const forkQuiz = () => {
    quiz.forkQuiz();
  };

  const deleteQuiz = () => {
    quiz.delete();
  };

  const startGame = () => {
    Game.InitGame(quiz);
  };

  return (
    <div className="panel panel-defualt">
      <div className="panel-heading">
        <img
          className="quiz-panel-img"
          alt="quiz"
          src="./img/quiz-img/{{ id }}"
        />
      </div>
      <div className="panel-body">
        <h5 className="quiz-title">{quiz.title}</h5>
        <p className="tags-row">
          {quiz.user}
        </p>
        <p className="tags-row">
          <ul>
            {quiz.tags.map(tag => (
              <li>
                <label className="tags">{tag.name}</label>
              </li>
            ))}
          </ul>
        </p>
      </div>
      <div className="panel-footer">
        {quiz.owner === Meteor.user()._id
          ? <span>
            <a
              href='javascript:void(0)'
              className="delete"
              onClick={deleteQuiz}
            >
              <i className="glyphicon glyphicon-remove" />
            </a>
            <a href={`/EditQuiz/${quiz._id}`} className="star">
              <span className="glyphicon glyphicon-pencil" />
            </a>
            <a href="javascript:void(0)" className="btn" onClick={startGame}>
              העתק שאלון
            </a>
          </span>
          : <span>
            <a href="javascript:void(0)" className="btn" onClick={forkQuiz}>
              העתק שאלון
            </a>
            <a href={`/ViewQuiz/${quiz._id}`} className="btn">צפה בפרטים</a>
          </span>}
      </div>
    </div>
  );
};

export default QuizCard;
