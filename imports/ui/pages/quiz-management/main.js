import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Quiz from '../../../api/quizes/quizes';
import Game from '../../../api/games/games';
import QuizCard from '../../components/quiz-card';
import Loading from '../../components/loading';
import GameCardPlayed from '../../components/gameCardPlayed';
import GameCardManaged from '../../components/gameCardManaged.js';

const tabNames = {
  myQuizes: 'my-quizes',
  gamesManaged: 'games-managed',
  gamesPlayed: 'games-played',
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: tabNames.myQuizes,
    };
  }

  render() {
    const { quizes, gamesManaged, gamesPlayed } = this.props;
    const activeTab = this.state.activeTab;

    const changeTab = tabName => () => this.setState({ activeTab: tabName });
    return (
      <div id="quiz-management-main">
        <div className="tab-btns btn-pref btn-group btn-group-justified btn-group-lg" role="group">
          <div className="btn-group" role="group">
            <button
              className={`btn ${activeTab === tabNames.myQuizes ? 'btn-primary' : 'btn-default'}`}
              onClick={changeTab(tabNames.myQuizes)}
            >
              <span className="glyphicon glyphicon-list-alt" aria-hidden="true" />
              <div className="hidden-xs">השאלונים שלי</div>
            </button>
          </div>
          <div className="btn-group" role="group">
            <button
              className={`btn ${activeTab === tabNames.gamesManaged
                ? 'btn-primary'
                : 'btn-default'}`}
              onClick={changeTab(tabNames.gamesManaged)}
            >
              <span className="glyphicon glyphicon-briefcase" aria-hidden="true" />
              <div className="hidden-xs">משחקים שניהלתי</div>
            </button>
          </div>
          <div className="btn-group" role="group">
            <button
              className={`btn ${activeTab === tabNames.gamesPlayed
                ? 'btn-primary'
                : 'btn-default'}`}
              onClick={changeTab(tabNames.gamesPlayed)}
            >
              <span className="glyphicon glyphicon-stats" aria-hidden="true" />
              <div className="hidden-xs">משחקים ששיחקתי</div>
            </button>
          </div>
        </div>
        <div className="">
          <div className="tab-content">
            <div className={`tab-pane fade in ${activeTab === tabNames.myQuizes ? 'active' : ''}`}>
              <a href="/CreateQuiz" className="add-question">
                <div className="panel panel-default" id="add-quiz-panel">
                  <div className="panel-body">
                    <span className="glphicon glyphicon-plus" id="add-quiz-plus-icon" />
                  </div>
                </div>
              </a>
              {quizes.length
                ? quizes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)
                : <div>לא יצרת אפילו שאלון אחד, למה אתה מחכה?</div>}
            </div>

            <div
              className={`tab-pane fade in ${activeTab === tabNames.gamesManaged ? 'active' : ''}`}
            >
              {gamesManaged.length
                ? gamesManaged.map(game => <GameCardManaged key={game._id} game={game} />)
                : <h3>עדיין לא ארגנת משחק לחברים?</h3>}
            </div>

            <div
              className={`tab-pane fade in ${activeTab === tabNames.gamesPlayed ? 'active' : ''}`}
            >
              {gamesPlayed.length
                ? gamesPlayed.map(game => <GameCardPlayed key={game._id} game={game} />)
                : <h3>איך עוד לא השתתפת באף משחק ? אתה לא רציני...</h3>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ManagementContainer = ({ loading, quizes, gamesPlayed, gamesManaged }) => {
  if (loading) return <Loading />;
  console.log('gamesManaged:');
  console.log(gamesManaged);
  console.log('gamesPlayed:');
  console.log(gamesPlayed);
  return <Main quizes={quizes} gamesPlayed={gamesPlayed} gamesManaged={gamesManaged} />;
};

export default createContainer(() => {
  Meteor.subscribe('tags.all');
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
  const gamesManaged = Game.find({ 'quiz.owner': Meteor.userId() }).fetch();
  const gamesPlayed = Game.find({ gameLog: { $elemMatch: { playerId: Meteor.userId() } } }).fetch();
  return {
    loading,
    quizes,
    gamesPlayed,
    gamesManaged,
  };
}, ManagementContainer);
