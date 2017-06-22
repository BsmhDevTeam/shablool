import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Game from '/imports/api/games/games';
import Quiz from '/imports/api/quizes/quizes';
import Tag from '/imports/api/tags/tags';


const QuizCard = ({ quiz }) => {
  const forkQuiz = () => {
    const questions = quiz.questions;
    const title = quiz.title;
    const tags = quiz.tags;
    const newQuiz = new Quiz({ questions, title, tags, owner: Meteor.userId() });
    newQuiz.create();
  };

  const deleteQuiz = () => {
    quiz.delete();
  };

  const initGame = () => {
    const game = new Game({ quiz });
    game.applyMethod('initGame', []);
    FlowRouter.go('Game.Main', { code: game.code });
  };
  return (
    <div className="panel panel-defualt">
      <div className="panel-heading">
        <img
          className="quiz-panel-img"
          src="../../img/quiz-default.png"
          alt="quiz"
        />
      </div>
      <div className="panel-body">
        <h5 className="quiz-title">{quiz.title}</h5>
        <p className="tags-row">
          {quiz.user}
        </p>
        <div className="tags-row">
          <ul>
            {quiz.tags.map(tag => (
              <li key={tag}>
                <label className="tags">{Tag.findOne(tag)}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="panel-footer">
        {quiz.owner === Meteor.userId()
          ? <span>
            <a
              href="javascript:void(0)"
              className="delete"
              onClick={deleteQuiz}
            >
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
