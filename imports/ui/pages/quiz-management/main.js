import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Quiz from '../../../api/quizes/quizes';
import Game from '../../../api/games/games';
import QuizCard from '../../components/quiz-card';
import Loading from '../../components/loading';
import GameCardPlayed from '../../components/gameCardPlayed';

const Main = ({ quizes, gamesPlayed, gamesManaged }) => (
  <div id="quizes">
    <div>
      <div className="card">
        <div
          className="btn-pref btn-group btn-group-justified btn-group-lg"
          role="group"
          aria-label="..."
        >
          <div className="btn-group" role="group">
            <button
              type="button"
              id="stars"
              className="btn btn-primary"
              href="#tab1"
              data-toggle="tab"
            >
              <span
                className="glyphicon glyphicon-list-alt"
                aria-hidden="true"
              />
              <div className="hidden-xs">השאלונים שלי</div>
            </button>
          </div>
          <div className="btn-group" role="group">
            <button
              type="button"
              id="favorites"
              className="btn btn-default"
              href="#tab2"
              data-toggle="tab"
            >
              <span
                className="glyphicon glyphicon-briefcase"
                aria-hidden="true"
              />
              <div className="hidden-xs">משחקים שניהלתי</div>
            </button>
          </div>
          <div className="btn-group" role="group">
            <button
              type="button"
              id="following"
              className="btn btn-default"
              href="#tab3"
              data-toggle="tab"
            >
              <span
                className="glyphicon glyphicon-stats"
                aria-hidden="true"
              />
              <div className="hidden-xs">משחקים ששיחקתי</div>
            </button>
          </div>
        </div>
      </div>
      <div className="">
        <div className="tab-content">
          <div className="tab-pane fade in active" id="tab1">
            <h3>השאלונים שלי</h3>
            <div className="row">
              <a href="/CreateQuiz" className="add-question">
                <div className="panel panel-default" id="add-quiz-panel">
                  <div className="panel-body">
                      <span
                        className="glphicon glyphicon-plus"
                        id="add-quiz-plus-icon"
                      />
                    </div>
                </div>
              </a>
            </div>
            <div className="row">
              {quizes.length
                  ? quizes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)
                  : <div>לא יצרת אפילו שאלון אחד, למה אתה מחכה?</div>}
            </div>
          </div>
          <div className="tab-pane fade in" id="tab2">
            <h3>כאן יהיו תוצאות המשחקים</h3>
          </div>
          <div className="tab-pane fade in" id="tab3">
            <div className="row">
              {gamesPlayed.length
                  ? gamesPlayed.map(game => (
                    <GameCardPlayed key={game._id} game={game} />
                    ))
                  : <h3>איך עוד לא השתתפת באף משחק ? אתה לא רציני...</h3>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );

const ManagementContainer = ({
  loading,
  quizes,
  gamesPlayed,
  gamesManaged,
}) => {
  if (loading) return <Loading />;
  console.log('quizes');
  console.log(quizes);
  console.log('gamesPlayed');
  console.log(gamesPlayed);
  console.log('gamesManaged');
  console.log(gamesManaged);
  return (
    <Main
      quizes={quizes}
      gamesPlayed={gamesPlayed}
      gameManaged={gamesManaged}
    />
  );
};

export default createContainer(() => {
  const usersHandle = Meteor.subscribe('users.names');
  const quizesHandle = Meteor.subscribe('quizes.my-quizes');
  const gamesPlayedHandle = Meteor.subscribe('games.games-played');
  const gamesManagedHandle = Meteor.subscribe('games.games-managed');

  const loading =
    !quizesHandle.ready() ||
    !usersHandle.ready() ||
    !gamesPlayedHandle.ready() ||
    !gamesManagedHandle.ready();
  const quizes = Quiz.find().fetch();
  const gamesManaged = Game.find(g => g.quiz.owner === Meteor.userId()).fetch();
  const gamesPlayed = Game.find(g =>
    g.gameLog
      .filter(e => e.nameType === Game.getEventTypes().PlayerReg)
      .find(e => e.playerId === this.userId),
  ).fetch();
  return {
    loading,
    quizes,
    gamesPlayed,
    gamesManaged,
  };
}, ManagementContainer);
