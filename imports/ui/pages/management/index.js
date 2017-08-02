import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import Quiz from '/imports/api/quizes/quizes';
import Game from '/imports/api/games/games';
import QuizCard from '/imports/ui/components/quiz-card';
import Loading from '/imports/ui/components/loading';
import GameCardPlayed from '/imports/ui/components/game-card-played';
import GameCardManaged from '/imports/ui/components/game-card-managed.js';
import { managementTabs } from '/imports/startup/both/constants.js';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: managementTabs.myQuizes,
      quizToDelete: null,
      showDeleteQuizAlert: false,
      quizDeleted: false,
      quizForked: false,
    };
  }

  render() {
    const { quizes, gamesManaged, gamesPlayed } = this.props;
    const { activeTab, quizDeleted, quizForked, showDeleteQuizAlert, quizToDelete } = this.state;

    const changeTab = tabName => () => this.setState({ activeTab: tabName });

    const showDeleteAlert = (quiz) => {
      this.setState({ quizToDelete: quiz, showDeleteQuizAlert: true });
    };

    const deleteQuiz = () => {
      quizToDelete.applyMethod('delete', []);

      const notifyUser = () => {
        this.setState({ quizDeleted: true });
        setTimeout(() => this.setState({ quizDeleted: false }), 3000);
      };
      notifyUser();
    };

    const forkQuiz = (quiz) => {
      const newQuiz = new Quiz({
        questions: quiz.questions,
        title: quiz.title,
        tags: quiz.tags,
        owner: Meteor.userId(),
      });
      newQuiz.applyMethod('create', []);

      const notifyUser = () => {
        this.setState({ quizForked: true });
        setTimeout(() => this.setState({ quizForked: false }), 3000);
      };
      notifyUser();
    };

    const actions = {
      showDeleteAlert,
      forkQuiz,
    };

    return (
      <div id="quiz-management-main">
        <div
          className="tab-btns btn-pref btn-group btn-group-justified btn-group-lg"
          id="tabs-area"
          role="group"
        >
          <div className="btn-group" role="group">
            <button
              className={`btn ${activeTab === managementTabs.myQuizes
                ? 'btn-primary'
                : 'btn-default'}`}
              onClick={changeTab(managementTabs.myQuizes)}
            >
              <span className="glyphicon glyphicon-list-alt" aria-hidden="true" />
              <div className="hidden-xs">השאלונים שלי</div>
            </button>
          </div>
          <div className="btn-group" role="group">
            <button
              className={`btn ${activeTab === managementTabs.gamesManaged
                ? 'btn-primary'
                : 'btn-default'}`}
              onClick={changeTab(managementTabs.gamesManaged)}
            >
              <span className="glyphicon glyphicon-briefcase" aria-hidden="true" />
              <div className="hidden-xs">משחקים שניהלתי</div>
            </button>
          </div>
          <div className="btn-group" role="group">
            <button
              className={`btn ${activeTab === managementTabs.gamesPlayed
                ? 'btn-primary'
                : 'btn-default'}`}
              onClick={changeTab(managementTabs.gamesPlayed)}
            >
              <span className="glyphicon glyphicon-stats" aria-hidden="true" />
              <div className="hidden-xs">משחקים ששיחקתי</div>
            </button>
          </div>
        </div>
        <div className="">
          <div className="tab-content">
            <div
              className={`tab-pane fade in ${activeTab === managementTabs.myQuizes
                ? 'active'
                : ''}`}
            >
              <div className="row">
                <a href="/CreateQuiz" className="add-question">
                  <div className="panel panel-default" id="add-quiz-panel">
                    <div className="panel-body">
                      <span className="glphicon glyphicon-plus" id="add-quiz-plus-icon" />
                    </div>
                  </div>
                </a>
              </div>
              {quizes.length
                ? quizes.map(quiz =>
                  <div className="row" key={quiz._id}>
                    <QuizCard quiz={quiz} actions={actions} />
                  </div>,
                  )
                : <h3>לא יצרת אפילו שאלון אחד, למה אתה מחכה?</h3>}
            </div>

            <div
              className={`tab-pane fade in ${activeTab === managementTabs.gamesManaged
                ? 'active'
                : ''}`}
            >
              {gamesManaged.length
                ? gamesManaged.map(game =>
                  <div className="row" key={game._id}>
                    <GameCardManaged game={game} />
                  </div>,
                  )
                : <h3>עדיין לא ארגנת משחק לחברים?</h3>}
            </div>

            <div
              className={`tab-pane fade in ${activeTab === managementTabs.gamesPlayed
                ? 'active'
                : ''}`}
            >
              {gamesPlayed.length
                ? gamesPlayed.map(game =>
                  <div className="row" key={game._id}>
                    <GameCardPlayed game={game} />
                  </div>,
                  )
                : <h3>איך עוד לא השתתפת באף משחק ? אתה לא רציני...</h3>}
            </div>
          </div>
        </div>
        <div id="snackbar" className={quizDeleted || quizForked ? 'show' : ''}>
          {quizDeleted ? 'השאלון נמחק בהצלחה' : 'השאלון הועתק בהצלחה'}
        </div>
        <SweetAlert
          show={showDeleteQuizAlert}
          title="מחיקת שאלון"
          type="warning"
          text={
            showDeleteQuizAlert
              ? `האם אתה בטוח שברצונך למחוק את השאלון: ${quizToDelete.title}?`
              : ''
          }
          showCancelButton
          confirmButtonText="מחק!"
          cancelButtonText="בטל"
          onConfirm={() => {
            deleteQuiz();
            this.setState({ quizToDelete: null, showDeleteQuizAlert: false });
          }}
          onCancel={() => {
            this.setState({ quizToDelete: null, showDeleteQuizAlert: false });
          }}
          onEscapeKey={() => this.setState({ showDeleteQuizAlert: false })}
          onOutsideClick={() => this.setState({ showDeleteQuizAlert: false })}
        />
      </div>
    );
  }
}

Main.propTypes = {
  quizes: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesManaged: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesPlayed: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ManagementContainer = ({ loading, quizes, gamesPlayed, gamesManaged }) => {
  if (loading) return <Loading />;
  return <Main quizes={quizes} gamesPlayed={gamesPlayed} gamesManaged={gamesManaged} />;
};

ManagementContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  quizes: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesManaged: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamesPlayed: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(() => {
  const imagesHandle = Meteor.subscribe('images.all');
  const tagsHandle = Meteor.subscribe('tags.all');
  const usersHandle = Meteor.subscribe('users.names');
  const quizesHandle = Meteor.subscribe('quizes.my-quizes');
  const gamesPlayedHandle = Meteor.subscribe('games.games-played');
  const gamesManagedHandle = Meteor.subscribe('games.games-managed');

  const loading =
    !imagesHandle.ready() ||
    !tagsHandle.ready() ||
    !quizesHandle.ready() ||
    !usersHandle.ready() ||
    !gamesPlayedHandle.ready() ||
    !gamesManagedHandle.ready();

  const quizes = Quiz.find().fetch();
  const gamesManaged = Game.find({ 'quiz.owner': Meteor.userId() }).fetch().reverse();
  const gamesPlayed = Game.find({
    gameLog: { $elemMatch: { playerId: Meteor.userId() } },
  })
    .fetch()
    .reverse();
  return {
    loading,
    quizes,
    gamesPlayed,
    gamesManaged,
  };
}, ManagementContainer);
