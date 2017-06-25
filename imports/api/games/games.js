import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import {
  max,
  countBy,
  groupBy,
  sortBy,
  mapObject,
  pairs,
  reduceRight,
  pluck,
  first,
} from 'underscore';
import Quiz from '../quizes/quizes.js';

const calculateTimeDelta = (t1, t2) => {
  const datesDelta = t1.getTime() - t2.getTime();
  const secondsBetweenTime = datesDelta / 1000;
  const secondsBetweenDates = Math.abs(secondsBetweenTime);
  return secondsBetweenDates;
};

const calculateScore = (dt, s, qt) => {
  const portion = s > 0 ? qt - dt : dt;
  const finalScore = (portion / qt) * s;
  return Math.round(finalScore);
};

const generateCode = (n) => {
  const lowerBound = 10 ** (n - 1);
  const upperBound = 10 ** n;
  const randUpperBound = upperBound - lowerBound - 1;
  const rand = randUpperBound * Math.random();
  return Math.floor(rand + lowerBound);
};

const eventTypes = {
  GameInit: 'GameInit',
  PlayerReg: 'PlayerReg',
  GameStarted: 'GameStarted',
  QuestionStart: 'QuestionStart',
  PlayerAnswer: 'PlayerAnswer',
  QuestionEnd: 'QuestionEnd',
  ShowLeaders: 'ShowLeaders',
  GameEnd: 'GameEnd',
  GameClose: 'GameClose',
};

export const GameInit = Class.create({
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

export const PlayerReg = Class.create({
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

export const GameStarted = Class.create({
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

export const QuestionStart = Class.create({
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

export const PlayerAnswer = Class.create({
  name: 'PlayerAnswer',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.PlayerAnswer;
      },
    },
    playerId: {
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

export const QuestionEnd = Class.create({
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

export const ShowLeaders = Class.create({
  name: 'ShowLeaders',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.ShowLeaders;
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

export const GameEnd = Class.create({
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

export const GameClose = Class.create({
  name: 'GameClose',
  fields: {
    nameType: {
      type: String,
      default() {
        return eventTypes.GameClose;
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
        return generateCode(6).toString();
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

  meteorMethods: {},

  helpers: {
    getGamePage() {
      return reduceRight(
        this.gameLog,
        (page, event) => {
          const isPlayerEvent =
            event.nameType === eventTypes.PlayerAnswer || event.nameType === eventTypes.PlayerReg;
          return (
            page ||
            (!isPlayerEvent && event.nameType) ||
            (isPlayerEvent && event.playerId === Meteor.userId() && event.nameType)
          );
        },
        '',
      );
    },
    isUserRegistered() {
      const isUserExist = this.getGamePlayersId().find(user => user === Meteor.userId());
      return !!isUserExist;
    },
    answersGroupCount() {
      const lastQuestionId = this.lastQuestionToStartId(); // => qId
      const getAnswerOrder = id =>
        this.quiz.questions.find(q => q._id === lastQuestionId).answers.find(a => a._id === id)
          .order; // answer._id => answer.order
      const playersAnswerEvents = this.getQuestionAnswers() // => [PlayerAnswer, ...]
        .map(e => e.answerId) // => [answerId, ...]
        .map(getAnswerOrder) // => [answerOrder, ...]
        .concat([1, 2, 3, 4]); // => so there will always be 4 columns in the bar chart
      const questionsAnswersJson = countBy(playersAnswerEvents, o => o); // => {1: num, 2: num, ...}
      const questionAnswersArray = pairs(questionsAnswersJson).map(a => ({
        answerOrder: a[0],
        count: a[1],
      }));
      const answerOrderCount = questionAnswersArray.map(a => ({
        answerOrder: a.answerOrder,
        count: a.count - 1, // because we addere 1 to the count before
      }));
      return answerOrderCount;
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
        .filter(e => e.nameType === eventTypes.PlayerAnswer) // => [PlayerAnswer]
        .map(({ playerId, answerId, questionId, createdAt }) => ({
          playerId,
          timeDelta: calculateTimeDelta(createdAt, this.getQuestionStartTime(questionId)),
          answerScore: this.getAnswerScore(questionId, answerId),
          questionTime: this.getQuestionTime(questionId),
        })) // => [{playerId, timeDelta: t, answerScore: a, questionTime: q}]
        .map(({ playerId, timeDelta, answerScore, questionTime }) => ({
          playerId,
          userScore: calculateScore(timeDelta, answerScore, questionTime),
        })); // => [{playerId: id, userScore: score}, ...]
      const scoresByUser = mapObject(groupBy(playersAnswers, 'playerId'), a =>
        pluck(a, 'userScore'),
      ); // => {playerId: [score, score, score], ...}
      const finalScoreByUser = mapObject(scoresByUser, (val, key) =>
        val.reduce((a, b) => a + b, 0),
      ); // => {playerId: finalScore, ...}
      const scoreByUser = pairs(finalScoreByUser).map(a => ({
        userName: Meteor.users.findOne(a[0]).services.github.username,
        userScore: a[1],
      })); // => [{userName: name, userScore: score}, {userName: name, userScore: score}, ...]
      const scoreByUserNamesSorted = first(sortBy(scoreByUser, 'userScore'), 5);
      return scoreByUserNamesSorted; // => [{userName, score}, {userName: score},...] - 5 elements
    },
    getQuestionStartTime(qId) {
      const questionStartEvent = this.gameLog
        .filter(e => e.nameType === eventTypes.QuestionStart)
        .find(e => e.questionId === qId);
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
      const questionLog = this.gameLog.filter(e => e.nameType === eventTypes.QuestionStart);
      const orderedQuestionsLog = sortBy(questionLog, 'createdAt');
      const lastQuestionEvents = orderedQuestionsLog[orderedQuestionsLog.length - 1];
      const qId = lastQuestionEvents.questionId;
      return qId;
    },
    lastQuestionToStart() {
      const lastQuestionId = this.lastQuestionToStartId();
      const lastQuestion = this.quiz.questions.find(q => q._id === lastQuestionId);
      return lastQuestion;
    },
    lastQuestionToEndId() {
      const questionLog = this.gameLog.filter(e => e.nameType === eventTypes.QuestionEnd);
      const orderedQuestionsLog = sortBy(questionLog, 'createdAt');
      const lastQuestionEvents = orderedQuestionsLog[orderedQuestionsLog.length - 1];
      const qId = lastQuestionEvents.questionId;
      return qId;
    },
    lastQuestionToEnd() {
      const lastQuestionId = this.lastQuestionToEndId();
      const lastQuestion = this.quiz.questions.find(q => q._id === lastQuestionId);
      return lastQuestion;
    },
    getGamePlayersId() {
      const playerEvent = this.gameLog.filter(e => e.nameType === eventTypes.PlayerReg);
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
      return first(this.scoreList());
    },
    isCurrentQuestionEnded() {
      const isEnded = this.lastQuestionToStartId() === this.lastQuestionToEndId();
      return isEnded;
    },
    nextQuestionId() {
      const lastQuestion = this.lastQuestionToEnd();
      const lastQuestionOrder = lastQuestion.order;
      const nextQuestion = this.quiz.questions.find(q => q.order === lastQuestionOrder + 1);
      return this.isCurrentQuestionEnded() ? nextQuestion._id : null;
    },
    getEventTypes() {
      return eventTypes;
    },
    isLastQuestion() {
      const lastQuestionOrder = max(this.quiz.questions, q => q.order).order;
      return lastQuestionOrder === this.lastQuestionToEnd().order;
    },
    getQuestionTimeLeft(questionId) {
      const questionStartEvents = this.gameLog.filter(e => e.nameType === eventTypes.QuestionStart);
      const questionStartEvent = this.gameLog.filter(e => e.questionId === questionId);
      // Check if question already ended
      // const questionEndEvents = this.gameLog.find(e => e.nameType === eventTypes.QuestionEnd);
      // const questionEndEvent = this.gameLog.find(e => e.questionId === questionId);
      // const isQuestionEnded = !!questionEndEvent;
      // calculate time passed
      const currentTime = new Date();
      const currentTimeInSeconds = currentTime.getTime() / 1000;
      const timePassed = questionStartEvent.map(e => currentTimeInSeconds - (e.createdAt.getTime() / 1000));
      const timeLeft = timePassed.map(t => this.quiz.questions.find(q => q._id === questionId).time - t);
      return timeLeft < 0 ? 0 : Math.round(timeLeft);
    },
  },
});
