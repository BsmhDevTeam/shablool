import { Meteor } from 'meteor/meteor';
import React from 'react';
import GameNavbar from '../../components/game-navbar';

const Leaders = ({ game }) => {
  const nextQuestion = () => {
    game.applyMethod('endGameOrNextQuestion', []);
  };
  return (
    <div id="leaders">
      <div className="game-background" />
      {game.quiz.owner === Meteor.userId()
        ? <div className="row">
          <div className="next-question-button">
            <button className="btn btn-primary" onClick={nextQuestion}>
              {game.isLastQuestion() ? 'מי ניצח?' : 'שאלה הבאה'}
            </button>
          </div>
        </div>
        : ''}
      <div className="row">
        <GameNavbar text="Leaders" num="" />
      </div>
      <div className="row">
        <table className="table leaders-table">
          <tbody>
            {game.getLeaders().map((object, index) =>
              <tr className={index === 0 ? 'leader' : ''}>
                <td className="to-the-right">
                  {object.userScore}
                </td>
                <td>
                  {object.userName}
                </td>
              </tr>,
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaders;
