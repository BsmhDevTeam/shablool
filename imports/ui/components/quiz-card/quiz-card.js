import React from 'react';
import { Meteor } from 'meteor/meteor';
import Game from '/imports/api/games/games';
import Quiz from '/imports/api/quizes/quizes';

const QuizCard = ({ quiz }) => {
  const forkQuiz = () => {
    const questions = quiz.questions;
    const title = quiz.title;
    const newQuiz = new Quiz({ questions, title, owner: Meteor.userId() });
    newQuiz.create();
  };

  const deleteQuiz = () => {
    quiz.delete();
  };

  const initGame = () => {
    Game.InitGame(quiz);
  };
  return (
    <div className="panel panel-defualt">
      <div className="panel-heading">
        <img
          className="quiz-panel-img"
          alt="quiz"
          src="../../img/quiz-img/{{ id }}.png"
          onError="this.src='../../img/quiz-default.png'"
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
        {quiz.owner === Meteor.userId()
          ?
        <span>
          <a href="javascript:void(0)" className="delete" onClick={deleteQuiz}>
            <i className="glyphicon glyphicon-remove" />
          </a>
          <a href={`/EditQuiz/${quiz._id}`} className="star">
            <span className="glyphicon glyphicon-pencil" />
          </a>
          <a href="javascript:void(0)" className="btn" onClick={initGame}>
            התחל משחק!
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
