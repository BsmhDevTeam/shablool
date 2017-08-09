import { Meteor } from 'meteor/meteor';
import { max } from 'underscore';
import { check } from 'meteor/check';
import {
  joinGameResults,
  eventTypes,
  startGameResults,
  endGameResults,
} from '/imports/startup/both/constants';
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
      const isPlayerRegister = !!this.gameLog.find(
        e => e.nameType === eventTypes.PlayerReg,
      );
      const isGameStarted = !!this.gameLog.find(
        e => e.nameType === eventTypes.GameStart,
      );
      const start = () => {
        // Starting game
        const gameStart = new GameStart();
        this.gameLog = this.gameLog.concat(gameStart);
        this.save();
        // Starting first question
        const firstQuestion = this.quiz.questions.find(q => q.order === 1);
        const questionStarted = new QuestionStart({
          questionId: firstQuestion._id,
        });
        this.gameLog = this.gameLog.concat(questionStarted);
        this.save();
        // Ending question
        const questionEndToLog = () => {
          this.questionEnd(firstQuestion._id);
        };
        Meteor.setTimeout(questionEndToLog, firstQuestion.time * 1000);
        // Closing Game
        const closeGameToLog = () => this.closeGame(this._id);
        Meteor.setTimeout(closeGameToLog, 24 * 60 * 60 * 1000); // close game after 24H
        return startGameResults.startSucc;
      };
      return (
        (!isPlayerRegister && startGameResults.noPlayersReg) ||
        (!this.isManager() && startGameResults.notOwner) ||
        (isGameStarted && startGameResults.alreadyStarted) ||
        start()
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
    questionStart(qId) {
      Game.update(
        {
          $and: [
            { _id: this._id },
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
          ],
        },
        {
          $push: {
            gameLog: new QuestionStart({ questionId: qId }),
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
      return this.isEveryoneAnswered(qId);
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
    isEveryoneAnswered(qId) {
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
              $where() {
                return this.gameLog.filter(e => (e.nameType === eventTypes.PlayerAnswer) && (e.questionId === qId)).length
                === this.gameLog.filter(e => e.nameType === eventTypes.PlayerReg).length; },
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
  },
});

Meteor.methods({
  // Methods without instance:
  joinGame({ code }) {
    check(code, String);
    Game.update(
      {
        $and: [
          { code },
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
      (err, res) => (
        (res > 0)
      ),
    );
  },
});
