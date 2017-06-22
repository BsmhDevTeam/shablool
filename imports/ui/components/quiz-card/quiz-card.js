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
    const newQuiz = new Quiz({
      questions,
      title,
      tags,
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
              src="../../img/quiz-default.png"
              alt="quiz"
            />
          </div>
          <div className="col-md-4">
            <p><h5 className="quiz-title">{quiz.title}</h5></p>
            <p>
              <span className="quiz-owner-span">
                הועלה ע"י {quiz.owner}
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
                  <a
                    href="javascript:void(0)"
                    className="btn btn-primary start-game-btn"
                    onClick={initGame}
                  >
                    <span>התחל משחק! </span>
                    <span className="glyphicon glyphicon-play" />
                  </a>
                </div>
              </span>
              : <span>
                <div className="col-md-6">
                  <a
                    href="javascript:void(0)"
                    className="btn"
                    onClick={forkQuiz}
                  >
                      העתק שאלון
                    </a>
                </div>
                <div className="col-md-6">
                  <a href={`/ViewQuiz/${quiz._id}`} className="btn">
                      צפה בפרטים
                    </a>
                </div>
              </span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// const QuizCard = ({ quiz }) => {
//   const forkQuiz = () => {
//     const questions = quiz.questions;
//     const title = quiz.title;
//     const tags = quiz.tags;
//     const newQuiz = new Quiz({
//       questions,
//       title,
//       tags,
//       owner: Meteor.userId(),
//     });
//     newQuiz.create();
//   };

//   const deleteQuiz = () => {
//     quiz.delete();
//   };

//   const initGame = () => {
//     const game = new Game({ quiz });
//     game.applyMethod('initGame', []);
//     FlowRouter.go('Game.Main', { code: game.code });
//   };
//   return (
//     <div className="panel panel-defualt">
//       <div className="panel-heading">
//         <img
//           className="quiz-panel-img"
//           src="../../img/quiz-default.png"
//           alt="quiz"
//         />
//       </div>
//       <div className="panel-body">
//         <h5 className="quiz-title">{quiz.title}</h5>
//         <p className="tags-row">
//           {quiz.user}
//         </p>
//         <div className="tags-row">
//           <ul>
//             {quiz.tags.map(tag => (
//               <li key={tag}>
//                 <label className="tags">{Tag.findOne(tag)}</label>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div className="panel-footer">
// {quiz.owner === Meteor.userId()
//   ? <span>
//     <a
//       href="javascript:void(0)"
//       className="delete"
//       onClick={deleteQuiz}
//     >
//       <i className="glyphicon glyphicon-remove" />
//     </a>
//     <a href={`/EditQuiz/${quiz._id}`} className="star">
//       <span className="glyphicon glyphicon-pencil" />
//     </a>
//     <a href="javascript:void(0)" className="btn" onClick={initGame}>
//         התחל משחק!
//       </a>
//   </span>
//   : <span>
//     <a href="javascript:void(0)" className="btn" onClick={forkQuiz}>
//         העתק שאלון
//       </a>
//     <a href={`/ViewQuiz/${quiz._id}`} className="btn">צפה בפרטים</a>
//   </span>}
//       </div>
//     </div>
//   );
// };

export default QuizCard;
