import { Meteor } from 'meteor/meteor';
import React from 'react';
import GameNavbar from '../../components/game-navbar/game-navbar';

const Leaders = ({ game }) => {
  console.log('scoreList:');
  console.log(game.scoreList());
  const nextQuestion = () => {
    game.applyMethod('nextQuestion', []);
  };
  return (
    <div id="leaders">
      <div className="game-background" />
      {game.quiz.owner === Meteor.userId()
              ? <a
                href="javacript:void(0)"
                className="btn btn-primary"
                onClick={nextQuestion}
              >
                  לשאלה הבאה
                </a>
              : ''}
      <div className="row">
        <GameNavbar text="Leaders" num="" />
      </div>
      <div className="row">
        <div className="table">
          <tbody className="table-style">
            {game.scoreList().map((object, index) => (
              <tr className={index === 0 ? 'leader' : ''}>
                <td>
                  {object.userName}
                </td>
                <td className="to-the-right">
                  {object.userScore}
                </td>
              </tr>
            ))}
          </tbody>
        </div>
      </div>
    </div>
  );
};

export default Leaders;
