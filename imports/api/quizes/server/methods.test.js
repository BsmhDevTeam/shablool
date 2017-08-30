import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import uuidV4 from 'uuid/v4';
import Quiz, { Question, Answer } from '../quizes.js';
import './methods';

describe('quizes methods', function() {
  beforeEach(function() {
    resetDatabase();
  });

  describe('Quizes collection', function() {
    it('create correctly', function() {
      const newQuiz = new Quiz({
        title: 'test quiz',
        questions: [
          new Question({
            _id: uuidV4(),
            text: 'WhatsUp ?!',
            order: 1,
            time: 10,
            answers: [
              new Answer({
                _id: uuidV4(),
                text: 'good',
                order: 1,
                points: 10,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'bad',
                order: 2,
                points: 0,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'Awsome',
                order: 3,
                points: 100,
              }),
              new Answer({
                _id: uuidV4(),
                text: '...',
                order: 4,
                points: 0,
              }),
            ],
          }),
        ],
        tags: ['tag'],
        owner: 'Me',
      });
      const id = newQuiz.create();
      const created = Quiz.find({ _id: id });
      const collectionName = created._getCollectionName();
      const count = created.count();

      assert.equal(collectionName, 'quizes');
      assert.equal(count, 1);
    });
  });

  describe('Quizes collection', function() {
    it('delete correctly', function() {
      const newQuiz = new Quiz({
        title: 'test quiz',
        questions: [
          new Question({
            _id: uuidV4(),
            text: 'WhatsUp ?!',
            order: 1,
            time: 10,
            answers: [
              new Answer({
                _id: uuidV4(),
                text: 'good',
                order: 1,
                points: 10,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'bad',
                order: 2,
                points: 0,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'Awsome',
                order: 3,
                points: 100,
              }),
              new Answer({
                _id: uuidV4(),
                text: '...',
                order: 4,
                points: 0,
              }),
            ],
          }),
        ],
        tags: ['tag'],
        owner: 'Me',
      });
      const id = newQuiz.create();
      const newQuizFromDB = Quiz.findOne({ _id: id });
      newQuizFromDB.delete();
      const created = Quiz.find({ _id: id });
      const count = created.count();

      assert.equal(count, 0);
    });
  });

  describe('Quizes collection', function() {
    it('update correctly', function() {
      const newQuiz = new Quiz({
        title: 'test quiz',
        questions: [
          new Question({
            _id: uuidV4(),
            text: 'WhatsUp ?!',
            order: 1,
            time: 10,
            answers: [
              new Answer({
                _id: uuidV4(),
                text: 'good',
                order: 1,
                points: 10,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'bad',
                order: 2,
                points: 0,
              }),
              new Answer({
                _id: uuidV4(),
                text: 'Awsome',
                order: 3,
                points: 100,
              }),
              new Answer({
                _id: uuidV4(),
                text: '...',
                order: 4,
                points: 0,
              }),
            ],
          }),
        ],
        tags: ['tag'],
        owner: 'Me',
      });
      const id = newQuiz.create();
      const newQuizFromDB = Quiz.findOne({ _id: id });
      newQuizFromDB.update({ title: 'new title', tags: ['new tag'] });
      const updated = Quiz.find({ title: 'new title', tags: ['new tag'] });
      const count = updated.count();

      assert.equal(count, 1);
    });
  });

  describe('Quizes validation', function() {
    it('create quiz without any questions', function() {
      const newQuiz = new Quiz({
        title: 'test quiz',
        questions: [],
        tags: ['tag'],
        owner: 'Me',
      });
      const create = () => newQuiz.create();
      assert.throws(create, Error, 'אתה לא יכול ליצור שאלון בלי שאלות [validation-error]');
    });
  });
});
