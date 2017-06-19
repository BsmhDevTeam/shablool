import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { countBy, groupBy, sortBy, mapObject, pairs } from 'underscore';
import Quiz from '../quizes/quizes.js';

const calculateTimeDelta = (t1, t2) => {
  const datesDelta = t1.getTime() - t2.getTime(); // TODO: Check if we need the getTime method.
  const secondsBetweenTime = datesDelta / 1000;
  const secondsBetweenDates = Math.abs(secondsBetweenTime);
  return secondsBetweenDates;
};

const calculateScore = (deltaTime, score, questionTime) => {
  // y = mx + n
  const timeFunc = deltaTime / questionTime;
  const mx = -Math.abs(score) / timeFunc;
  const finalScore = score > 0 ? mx + score : mx;
  return finalScore;
};

const generateCode = () => {
  const n = 6;
  return Math.floor(
    (10 ** n - 10 ** (n - 1) - 1) * Math.random() + 10 ** (n - 1),
  );
};

const eventTypes = {
  GameInit: 'GameInit',
  PlayerReg: 'PlayerReg',
  GameStarted: 'GameStarted',
  QuestionStart: 'QuestionStart',
  PlayerAnswer: 'PlayerAnswer',
  QuestionEnd: 'QuestionEnd',
  GameEnd: 'GameEnd',
};

const GameInit = Class.create({
  name: 'GameInit',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.GameInit;
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

const PlayerReg = Class.create({
  name: 'PlayerReg',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.PlayerReg;
      },
    },
    playerId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

const GameStarted = Class.create({
  name: 'GameStarted',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.GameStarted;
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

const QuestionStart = Class.create({
  name: 'QuestionStart',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.QuestionStart;
      },
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
  },
});

const PlayerAnswer = Class.create({
  name: 'PlayerAnswer',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.PlayerAnswer;
      },
    },
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
  },
});

const QuestionEnd = Class.create({
  name: 'QuestionEnd',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.QuestionEnd;
      },
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
  },
});

const GameEnd = Class.create({
  name: 'GameEnd',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.GameEnd;
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },
});

export default Class.create({
  name: 'Game',
  collection: new Mongo.Collection('games'),
  fields: {
    quiz: Quiz,
    gameLog: {
      type: [Object],
      default() {
        return [new GameInit()];
      },
    },
    code: {
      type: String,
      default() {
        return generateCode().toString();
      },
    },
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },
    lastUpdate: {
      type: Date,
      default() {
        return new Date();
      },
    },
  },

  meteorMethods: {
    initGame() {
      return this.save();
    },
    playerRegister() {
      const registerPlayer = () => {
        const newReg = new PlayerReg({
          playerId: Meteor.userId(),
        });
        this.gameLog = this.gameLog.concat(newReg);
        this.save();
        return true;
      };
      return !this.isUserRegistered() && registerPlayer();
    },
    startGame() {
      // Starting game
      const gameStarted = new GameStarted();
      this.gameLog = this.gameLog.concat(gameStarted);
      this.save();
      // Starting first question
      const firstQuestion = this.quiz.questions.find(q => q.order === 1);
      const questionStarted = new QuestionStart({
        questionId: firstQuestion._id,
      });
      this.gameLog = this.gameLog.concat(questionStarted);
      this.save();
      // Ending question
      const questionEnd = new QuestionEnd({
        questionId: firstQuestion._id,
      });
      const questionEndToLog = () => {
        this.gameLog = this.gameLog.concat(questionEnd);
        this.save();
      };
      setTimeout(questionEndToLog, firstQuestion.time);
      return true;
    },
    playerAnswer(uId, qId, aId) {
      const playerAnswerEvent = new PlayerAnswer({
        userId: uId,
        questionId: qId,
        answerId: aId,
      });
      this.gameLog = this.gameLog.concat(playerAnswerEvent);
      this.save();
      return true;
    },
    nextQuestion() {
      const qId = this.nextQuestionId();
      const questionStarted = new QuestionStart({
        questionId: qId,
      });
      const questionEnd = new QuestionEnd({
        questionId: qId,
      });
      const q = this.quiz.questions.find(ques => ques._id === qId);
      const questionEndToLog = () => {
        this.gameLog = this.gameLog.concat(questionEnd);
        this.save();
      };
      this.gameLog = this.gameLog.concat(questionStarted);
      this.save();
      setTimeout(questionEndToLog, q.time);
      return true;
    },
  },
  helpers: {
    isUserRegistered() {
      const isUserExist = this.getGamePlayersId().find(user => user === Meteor.userId());
      return !!isUserExist;
    },
    getLastQuestionId() {},
    answersGroupCount() {
      const lastQuestionId = this.lastQuestionToStartId();
      const getAnswerOrder = id =>
        this.quiz.questions
          .find(q => q._id === lastQuestionId)
          .answers.find(a => a._id === id).order;
      const playersAnswerEvents = this.getQuestionAnswers()
        .map(e => e.answerId)
        .map(getAnswerOrder);
      const questionsAnswers = countBy(playersAnswerEvents, o => o);
      return questionsAnswers;
    },
    answerCount() {
      const playersAnswerEvents = this.getQuestionAnswers();
      return playersAnswerEvents.length;
    },
    getQuestionAnswers() {
      const lastQuestionId = this.lastQuestionToStartId();
      const playersAnswerEvents = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer)
        .filter(e => e.questionId === lastQuestionId);
      return playersAnswerEvents;
    },
    scoreList() {
      const playersAnswers = this.gameLog
        .filter(e => e.nameType === eventTypes.PlayerAnswer) // => [PlayerAnswer, PlayerAnswer, PlayerAnswer...]
        .map(({ userId, answerId, questionId, createdAt }) => ({
          userId,
          timeDelta: calculateTimeDelta(
            createdAt,
            this.getQuestionStartTime(questionId),
          ),
          answerScore: this.getAnswerScore(questionId, answerId),
          questionTime: this.getQuestionTime(questionId),
        })) // => [{userId, timeDelta: t, answerScore: a, questionTime: q}, {...}...]
        .map(({ userId, timeDelta, answerScore, questionTime }) => ({
          userId,
          userScore: calculateScore(timeDelta, answerScore, questionTime),
        })); // => [{userId, userScore}, {userId, userScore},...]
      const scoresByUser = groupBy(playersAnswers, 'userId'); // => {userId: [score, score, score], userId: [score, score, score],...}
      const finalScoreByUser = mapObject(scoresByUser, (val, key) =>
        val.reduce((a, b) => a + b, 0),
      ); // => {userId: finalScore, ...}
      const scoreByUser = pairs(finalScoreByUser).map(a => ({
        userName: Meteor.users.findOne(u => u._id === a[0]).name,
        userScore: a[1],
      })); // => [{userName: name, userScore: score}, {userName: name, userScore: score}, ...]
      const scoreByUserNamesSorted = sortBy(scoreByUser, 'userScore').first(5);
      return scoreByUserNamesSorted; // => [{userName, score}, {userName: score},...] - 5 elements
    },
    getQuestionStartTime(qId) {
      const questionStartEvent = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionStart)
        .filter(e => e.questionId === qId);
      const questionStartTime = questionStartEvent.createdAt;
      return questionStartTime;
    },
    getAnswerScore(qId, aId) {
      const question = this.quiz.questions.find(q => q._id === qId);
      const answer = question.answers.find(a => a._id === aId);
      const score = answer.points;
      return score;
    },
    getQuestionTime(qId) {
      const question = this.quiz.questions.find(q => q._id === qId);
      const time = question.time;
      return time;
    },
    lastQuestionToStartId() {
      const questionLog = this.gameLog.filter(
        e => e.nameType === eventTypes.QuestionStart,
      );
      const orderedQuestionsLog = sortBy(questionLog, 'createdAt');
      const lastQuestionEvents =
        orderedQuestionsLog[orderedQuestionsLog.length - 1];
      const qId = lastQuestionEvents.questionId;
      return qId;
    },
    lastQuestionToEndId() {
      const questionLog = this.gameLog.filter(
        e => e.nameType === eventTypes.QuestionEnd,
      );
      const orderedQuestionsLog = sortBy(questionLog, 'createdAt');
      const lastQuestionEvents =
        orderedQuestionsLog[orderedQuestionsLog.length - 1];
      const qId = lastQuestionEvents.questionId;
      return qId;
    },
    getGamePlayersId() {
      const playerEvent = this.gameLog.filter(
        e => e.nameType === eventTypes.PlayerReg,
      );
      const playersId = playerEvent.map(e => e.playerId);
      return playersId;
    },
    getGamePlayersName() {
      const playersId = this.getGamePlayersId();
      const players = playersId.map(pId => Meteor.users.findOne(pId));
      const playersName = players.map(p => p.services.github.username);
      return playersName;
    },
    getLastEvent() {
      const lastEvent = this.gameLog[this.gameLog.length - 1];
      return lastEvent;
    },
    getWinner() {
      return this.scoreList().first();
    },
    isCurrentQuestionEnded() {
      const isEnded =
        this.lastQuestionToStartId() === this.lastQuestionToEndId();
      return isEnded;
    },
    nextQuestionId() {
      const currentQuestionId = this.lastQuestionToEndId();
      const currentQuestionOrder = this.quiz.questions.findOne(
        q => q._id === currentQuestionId,
      ).order;
      const nextQuestion = this.quiz.questions.findOne(
        q => q.order === currentQuestionOrder + 1,
      );
      return this.isCurrentQuestionEnded() ? nextQuestion._id : null;
    },
  },
});
