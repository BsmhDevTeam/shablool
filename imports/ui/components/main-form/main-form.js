import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Game from '/imports/api/games/games';
import { FlowRouter } from 'meteor/kadira:flow-router';

const MainForm = () => {
  const gameReg = (event) => {
    event.preventDefault();
    const gameCode = event.target.gameCode.value;
    const maybeGame = Game.find({ code: gameCode }).fetch();
    const gameWithNoRegisteredUser = maybeGame.filter(g => !g.isUserRegistered());
    const gamesWithRegisteredUser = [
      ...gameWithNoRegisteredUser.map(g => g.playerRegister() && g),
      ...maybeGame.filter(g => g.isUserRegistered()),
    ];
    const redirectToGame = gamesWithRegisteredUser.map(g => FlowRouter.go('Manage.Game', { code: g.code }));
    return redirectToGame.length ? null : alert('המשחק לא קיים');
  };
  return (
    <form onSubmit={gameReg}>
      <div className="row">
        <input
          type="text"
          name="gameCode"
          id="main-input"
          className="input"
          placeholder="הכנס קוד שאלון"
        />
      </div>
      <div className="row">
        <button className="btn btn-primary" type="submit" id="start-game-btn">
          התחל משחק!
        </button>
      </div>
    </form>
  );
};

const GameManagerContainer = ({ loading }) => {
  if (loading) return <p>loading</p>;
  return <MainForm />;
};

export default createContainer(() => {
  const gameHandle = Meteor.subscribe('games.all');
  const loading = !gameHandle.ready();
  return {
    loading,
  };
}, GameManagerContainer);
