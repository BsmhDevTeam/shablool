import { assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import uuidV4 from 'uuid/v4';
import Quiz, { Question, Answer } from '../quizes.js';
import './methods';

describe('quizes methods', function() {
  beforeEach(function() {
    resetDatabase();
  });

  describe('Quizes collection', function() {
    it('create correctly', function() {
      const quiz = Factory.create('quiz');
      const created = Quiz.find({ _id: quiz._id });
      const collectionName = created._getCollectionName();
      const count = created.count();

      assert.equal(collectionName, 'quizes');
      assert.equal(count, 1);
    });

    it('delete correctly', function() {
      const quiz = Factory.create('quiz');
      const newQuizFromDB = Quiz.findOne({ _id: quiz._id });
      newQuizFromDB.delete();
      const created = Quiz.find({ _id: quiz._id });
      const count = created.count();

      assert.equal(count, 0);
    });

    it('update correctly', function() {
      const quiz = Factory.create('quiz');
      const newQuizFromDB = Quiz.findOne({ _id: quiz._id });
      newQuizFromDB.update({ title: 'new title', tags: ['new tag'] });
      const updated = Quiz.find({ title: 'new title', tags: ['new tag'] });
      const count = updated.count();

      assert.equal(count, 1);
    });
  });

  describe('Quizes validation', function() {
    it('create quiz without any questions', function() {
      const create = () => Factory.create('quiz', { questions: [] }).create();
      assert.throws(create, Error, 'אתה לא יכול ליצור שאלון בלי שאלות [validation-error]');
    });
  });
});
