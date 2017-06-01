import { Mongo } from 'meteor/mongo';
import { Class, Union } from 'meteor/jagi:astronomy';
import Quiz from '../quizes/quizes.js';

const GameInit = Class.create({
  name: 'GameInit',
  createdAt: {
    type: Date,
    default() {
      return new Date();
    },
  },
});

const PlayerReg = Class.create({
  name: 'PlayerReg',
  playerId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default() {
      return new Date();
    },
  },
});

const GameStarted = Class.create({
  name: 'GameStarted',
  createdAt: {
    type: Date,
    default() {
      return new Date();
    },
  },
});

const QuestionStart = Class.create({
  name: 'QuestionStart',
  questionId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default() {
      return new Date();
    },
  },
});

const PlayerAnswer = Class.create({
  name: 'PlayerAnswer',
  userId: {
    type: String,
  },
  answerId: {
    type: String,
  },
  questionId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default() {
      return new Date();
    },
  },
});

const QuestionEnd = Class.create({
  name: 'QuestionEnd',
  questionId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default() {
      return new Date();
    },
  },
});

const GameEnd = Class.create({
  name: 'GameEnd',
  createdAt: {
    type: Date,
    default() {
      return new Date();
    },
  },
});

const GameEvent = Union.create({
  name: 'GameInit',
  types: [
    GameInit,
    PlayerReg,
    GameStarted,
    QuestionStart,
    PlayerAnswer,
    QuestionEnd,
    GameEnd,
  ],
});

export const Games = new Mongo.Collection('games');

export default Class.create({
  name: 'Game',
  collection: Games,
  fields: {
    quiz: Quiz,
    players: [String],
    gameLog: {
      type: [GameEvent],
      default() {
        return [GameInit];
      },
    },
    state: Boolean,
    time: Number,
    createdAt: {
      value: Date,
      default: Date.Now(),
    },
    lastUpdate: {
      value: Date,
      default: Date.Now(),
    },
  },
  meteorMethods: {
    PlayerReg(userId) {
      const isUserExist = this.players.find(user => user === userId);
      const registerPlayer = () => {
        this.players = this.players.concat(userId);
        const newReg = new PlayerReg({
          playerId: userId,
        });
        this.gameLog = this.gameLog.concat(newReg);
        this.save();
        return true;
      };
      return isUserExist && registerPlayer;
    },
    StartGame() {
      const q = this.Quiz.questions.find(this.Quiz.questions.order === 1);
      const gameStarted = new GameStarted();
      const questionStarted = new QuestionStart({
        questionId: q._id,
      });
      const questionEnd = new QuestionEnd({
        questionId: q._id,
      });
      const questionEndToLog = () => {
        this.gameLog = setTimeout(this.gameLog.concat(questionEnd), q.time);
        this.save();
      };
      this.gameLog = this.gameLog.concat(gameStarted, questionStarted);  
      this.save();
      questionEndToLog();
      return true;
    },
    PlayerAnswer(uId, qId, aId) {
      const playerAnswer = new PlayerAnswer({
        userId: uId,
        questionId: qId,
        answerId: aId,
      });
      this.gameLog = this.gameLog.concat(playerAnswer);
      this.save();
      return true;
    },
    NextQuestion (qId) {
      const questionStarted = new QuestionStart({
        questionId: qId,
      });
      const questionEnd = new QuestionEnd({
        questionId: qId,
      });
      const questionEndToLog = () => {
        const q = this.Quiz.questions.find(this.Quiz.questions.order === 1);
        this.gameLog = setTimeout(this.gameLog.concat(questionEnd), q.time);
        this.save();
      };
      this.gameLog = this.gameLog.concat(questionStarted);  
      this.save();
      questionEndToLog();
      return true;
    },
  },
});

