import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Loading from '/imports/ui/components/loading';
import Game from '/imports/api/games/games';
import GameNavbar from '/imports/ui/components/game-navbar';

const Leaders = ({ game }) => {
  const nextQuestion = () => {
    game.applyMethod('endGameOrNextQuestion', []);
  };
  return (
    <div id="leaders">
      <div className="game-background" />
      {game.isManager()
        ? <div className="row">
          <div className="next-question-button">
            <button className="btn btn-primary" onClick={nextQuestion}>
              {game.isLastQuestion() ? 'מי ניצח?' : 'שאלה הבאה'}
            </button>
          </div>
        </div>
        : ''}
      <div className="row">
        <GameNavbar text="צמרת הטבלה" num="" />
      </div>
      <div className="row">
        <table className="table leaders-table">
          <tbody>
            {game.getLeaders().map((leader, index) =>
              <tr className={index === 0 ? 'leader' : ''} key={leader.userName}>
                <td className="to-the-right">
                  {leader.userScore}
                </td>
                <td>
                  {leader.userName}
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
