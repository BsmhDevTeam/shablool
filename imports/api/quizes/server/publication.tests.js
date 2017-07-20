import { resetDatabase } from 'meteor/xolvio:cleaner';
import { assert } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publication.js';
import Quiz from '../quizes.js';

describe('quizes publication', function() {
  beforeEach(function() {
    resetDatabase();
    new Quiz({
      _id: 'quiz1',
      title: 'title1',
      questions: [],
      tags: ['tag1'],
      owner: 'me',
      private: true,
    }).save();
    new Quiz({
      _id: 'quiz2',
      title: 'title2',
      questions: [],
      tags: ['tag2'],
      owner: 'me',
      private: false,
    }).save();
    new Quiz({
      _id: 'quiz3',
      title: 'title3',
      questions: [],
      tags: ['tag2'],
      owner: 'owner',
      private: false,
    }).save();
    new Quiz({
      _id: 'quiz4',
      title: 'title4',
      questions: [],
      tags: ['tag3'],
      owner: 'owner',
      private: true,
    }).save();
  });

  afterEach(function() {
    resetDatabase();
  });

  describe('quizes.my-quizes', function() {
    it('sends my quizes', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.my-quizes', (collections) => {
        assert.equal(collections.quizes.length, 2);
        done();
      });
    });
    it('sends tags', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.my-quizes', (collections) => {
        assert.equal(collections.quizes[0].tags.length, 1);
        done();
      });
    });
  });

  describe('quizes.get', function() {
    it('send my private quiz by id', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.get', 'quiz1', (collections) => {
        assert.equal(collections.quizes.length, 1);
        done();
      });
    });
    it('send other user public quiz by id', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.get', 'quiz3', (collections) => {
        assert.equal(collections.quizes.length, 1);
        done();
      });
    });
    it('send other user private quiz by id', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.get', 'quiz4', (collections) => {
        assert.equal(collections.quizes.length, 0);
        done();
      });
    });
  });

  describe('quizes.search', function() {
    it('serch quiz from my quizes', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.search', 'title1', (collections) => {
        assert.equal(collections.quizes.length, 1);
        done();
      });
    });
    it('serch quizes in my quizes and other user public quizes', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.search', 'title', (collections) => {
        assert.equal(collections.quizes.length, 3);
        done();
      });
    });
    it('search other user private quiz', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.search', 'title4', (collections) => {
        assert.equal(collections.quizes.length, 0);
        done();
      });
    });
    it('search other user public quiz', function(done) {
      const collector = new PublicationCollector({ userId: 'me' });
      collector.collect('quizes.search', 'title3', (collections) => {
        assert.equal(collections.quizes.length, 1);
        done();
      });
    });
  });
});
