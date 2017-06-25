import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Game from '/imports/api/games/games';
import Quiz from '/imports/api/quizes/quizes';

export default({ quiz }) => {
  const forkQuiz = () => {
    const newQuiz = new Quiz({
      questions: quiz.questions,
      title: quiz.title,
      tags: quiz.tags,
      owner: Meteor.userId(),
    });
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
    <div className="panel panel-default quiz-card" id={`quiz-card-${quiz._id}`}>
      <div className="panel-body">
        <div className="row">
          <div className="col-md-3">
            <img
              className="quiz-panel-img"
              src="/img/quiz-default.png"
              alt="quiz"
            />
          </div>
          <div className="col-md-4">
            <h5 className="quiz-title">{quiz.title}</h5>
            <p>
              <span className="quiz-owner-span">
                {`נוצר ע"י ${Meteor.users.findOne(quiz.owner).services.github.username}`}
              </span>
            </p>
            <p><strong>{quiz.questions.length} </strong><span>שאלות</span></p>
          </div>
          <div className="col-md-5 quiz-card-buttons-area">
            {quiz.owner === Meteor.userId()
              ? <span>
                <div className="col-md-4">
                  <a
                    href="javascript:void(0)"
                    className="delete quiz-card-link"
                    onClick={deleteQuiz}
                  >
                    <span className="glyphicon glyphicon-remove quiz-card-link-text-icon" />
                    <span className="quiz-card-link-text">מחק שאלון</span>
                  </a>
                </div>
                <div className="col-md-4">
                  <a
                    href={`/EditQuiz/${quiz._id}`}
                    className="star quiz-card-link"
                  >
                    <span className="glyphicon glyphicon-pencil quiz-card-link-text-icon" />
                    <span className="quiz-card-link-text quiz-card-link-text">
                        ערוך שאלון
                      </span>
                  </a>
                </div>
                <div className="col-md-4 quiz-card-start-button-area">
                  <button
                    className="btn btn-primary start-game-btn"
                    onClick={initGame}
                  >
                    <span>התחל משחק! </span>
                    <span className="glyphicon glyphicon-play" />
                  </button>
                </div>
              </span>
              : <span>
                <div className="col-md-6">
                  <a
                    href="javascript:void(0)"
                    className="delete quiz-card-link"
                    onClick={forkQuiz}
                  >
                    <span className="glyphicon glyphicon-duplicate quiz-card-link-text-icon" />
                    <span className="quiz-card-link-text quiz-card-link-text">
                        העתק שאלון
                      </span>
                  </a>
                </div>
                <div className="col-md-6">
                  <a
                    href={`/ViewQuiz/${quiz._id}`}
                    className="quiz-card-link"
                  >
                    <span className="glyphicon glyphicon-info-sign quiz-card-link-text-icon" />
                    <span className="quiz-card-link-text quiz-card-link-text">
                        צפה בפרטים
                      </span>
                  </a>
                </div>
              </span>}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {quiz.getTags().map(t => <TagTemplate key={t._id} tag={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const TagTemplate = ({ tag }) =>
  <h4 className="pull-right tag">
    <span className="label label-info" aria-hidden="true">
      {tag.name}
    </span>
  </h4>;
