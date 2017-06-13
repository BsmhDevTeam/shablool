import React from 'react';
import Game from '../../../api/games/games.js';
import GameNavbar from '../../components/game-navbar/game-navbar';

const Leaders = () => (
  <div id="leaders">
    <div className="container">
      <div className="row">
        <GameNavbar text="Leaders" num="" />
      </div>
      <div className="row">
        <div className="table">
          <tbody className="table-style">
            {Game.scoreList.map((object, index) => (
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
  </div>
);

export default Leaders;
