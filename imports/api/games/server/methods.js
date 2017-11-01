import { Meteor } from 'meteor/meteor';
import { max } from 'underscore';
import { check } from 'meteor/check';
import { eventTypes, joinGameResults } from '/imports/startup/both/constants';
import Game, {
  PlayerReg,
  GameStart,
  QuestionStart,
  QuestionEnd,
  PlayerAnswer,
  ShowLeaders,
  GameEnd,
  GameClose,
} from '../games';

Game.extend({
  meteorMethods: {
    initGame() {
      return this.save();
    },
    startGame() {
      // Starting game
      this.gameStart();
      // Starting first question
      const firstQuestion = this.quiz.questions.find(q => q.order === 1);
      this.questionStart(firstQuestion._id);
      // Ending question
      const questionEndToLog = () => {
        this.questionEnd(firstQuestion._id);
      };
      Meteor.setTimeout(questionEndToLog, firstQuestion.time * 1000);
      // Closing Game
      const closeGameToLog = () => this.closeGame();
      Meteor.setTimeout(closeGameToLog, 24 * 60 * 60 * 1000); // close game after 24H
    },
    gameStart() {
      Game.update(
        {
          $and: [
            { _id: this._id },
            {
              gameLog: {
                $elemMatch: {
                  nameType: eventTypes.PlayerReg,
                },
              },
            },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.GameStart,
                  },
                },
              },
            },
            {
              'quiz.owner': { $eq: Meteor.userId() },
            },
          ],
        },
        {
          $push: {
            gameLog: new GameStart(),
          },
        },
      );
    },
    questionStart(qId) {
      Game.update(
        {
          $and: [
            { _id: this._id },
            {
              gameLog: {
                $elemMatch: {
                  nameType: eventTypes.GameStart,
                },
              },
            },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.QuestionStart,
                    questionId: qId,
                  },
                },
              },
            },
            {
              'quiz.owner': { $eq: Meteor.userId() },
            },
          ],
        },
        {
          $push: {
            gameLog: new QuestionStart({ questionId: qId }),
          },
        },
      );
    },
    questionEnd(qId) {
      Game.update(
        {
          $and: [
            { _id: this._id },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.QuestionEnd,
                    questionId: qId,
                  },
                },
              },
            },
            {
              gameLog: {
                $elemMatch: {
                  nameType: eventTypes.QuestionStart,
                  questionId: qId,
                },
              },
            },
          ],
        },
        {
          $push: {
            gameLog: new QuestionEnd({ questionId: qId }),
          },
        },
      );
    },
    skipQuestion(qId) {
      Game.update(
        { _id: this._id },
        {
          $pushAll: {
            gameLog: [new QuestionEnd({ questionId: qId }), new ShowLeaders()],
          },
        },
      );
    },
    playerAnswer(qId, aId) {
      Game.update(
        {
          $and: [
            { _id: this._id },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.QuestionEnd,
                    questionId: qId,
                  },
                },
              },
            },
            {
              gameLog: {
                $elemMatch: {
                  nameType: eventTypes.QuestionStart,
                  questionId: qId,
                },
              },
            },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.PlayerAnswer,
                    playerId: Meteor.userId(),
                    questionId: qId,
                  },
                },
              },
            },
            {
              gameLog: {
                $elemMatch: {
                  nameType: eventTypes.PlayerReg,
                  playerId: Meteor.userId(),
                },
              },
            },
            {
              'quiz.owner': { $ne: Meteor.userId() },
            },
          ],
        },
        {
          $push: {
            gameLog: new PlayerAnswer({
              playerId: Meteor.userId(),
              questionId: qId,
              answerId: aId,
            }),
          },
        },
      );
      const isEveryoneAnswered = Game.findOne(this._id).isAllPlayerAnsweredToQuestion(qId);
      return isEveryoneAnswered && this.questionEnd(qId);
    },
    nextQuestion() {
      // start question
      const qId = this.nextQuestionId();
      this.questionStart(qId);
      // end question
      const q = this.quiz.questions.find(ques => ques._id === qId);
      const questionEndToLog = () => {
        this.questionEnd(qId);
      };
      Meteor.setTimeout(questionEndToLog, q.time * 1000);
      return true;
    },
    showLeaders() {
      Game.update(
        { _id: this._id },
        {
          $push: {
            gameLog: new ShowLeaders(),
          },
        },
      );
    },
    endGame() {
      Game.update(
        {
          $and: [
            { _id: this._id },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.GameEnd,
                  },
                },
              },
            },
            {
              gameLog: {
                $elemMatch: {
                  nameType: eventTypes.GameStart,
                },
              },
            },
            {
              'quiz.owner': Meteor.userId(),
            },
          ],
        },
        {
          $push: {
            gameLog: new GameEnd(),
          },
        },
      );
    },
    endGameOrNextQuestion() {
      const lastQuestionOrder = max(this.quiz.questions, q => q.order).order;
      return lastQuestionOrder === this.lastQuestionToEnd().order
        ? this.endGame()
        : this.nextQuestion();
    },
    closeGame() {
      Game.update(
        {
          $and: [
            { _id: this._id },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.GameClose,
                  },
                },
              },
            },
            {
              'quiz.owner': Meteor.userId(),
            },
          ],
        },
        {
          $push: {
            gameLog: new GameClose(),
          },
        },
      );
    },
  },
});

Meteor.methods({
  // Methods without instance:
  joinGame({ code }) {
    check(code, String);

    const currGame = Game.findOne({code});   

    if (currGame === undefined){       
      return joinGameResults.noGame;
    }
    else if (currGame.isManager()){              
      return joinGameResults.isManager;
    }
    else if (currGame.isUserRegistered()){                   
      return joinGameResults.alreadyRegistered;
    }
    else if (currGame.gameLog.find(event => event.nameType === eventTypes.GameStart)){                
      return joinGameResults.gameStarted;      
    }
    else {
      Game.update(
        {
          $and: [
            { code },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.GameStart,
                  },
                },
              },
            },
            {
              gameLog: {
                $not: {
                  $elemMatch: {
                    nameType: eventTypes.PlayerReg,
                    playerId: Meteor.userId(),
                  },
                },
              },
            },
            {
              'quiz.owner': { $ne: Meteor.userId() },
            },
          ],
        },
        {
          $push: {
            gameLog: new PlayerReg({ playerId: Meteor.userId() }),
          },
        },
      );                         
      return joinGameResults.regSucc;
    }
  },
});
