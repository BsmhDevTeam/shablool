import { Meteor } from 'meteor/meteor';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publication.js';

const asUser = (user) => {
  Meteor.userId.restore();
  sinon.stub(Meteor, 'userId', function() {
    return user; // User id
  });
};

describe('quizes publication', function() {
  beforeEach(function() {
    sinon.stub(Meteor, 'userId', function() {
      return 'owner'; // User id
    });
  });

  afterEach(function() {
    Meteor.userId.restore();
    resetDatabase();
  });

  describe('quizes.my-quizes', function() {
    it('sends my quizes', function(done) {
      const quiz = Factory.create('quiz');
      const collector = new PublicationCollector({ userId: 'owner' });
      collector.collect('quizes.my-quizes', (collections) => {
        expect(collections.quizes.length).to.equal(1);
        done();
      });
    });
    it('sends tags', function(done) {
      const quiz = Factory.create('quiz');
      const collector = new PublicationCollector({ userId: 'owner' });
      collector.collect('quizes.my-quizes', (collections) => {
        expect(collections.quizes[0].tags.length).to.equal(1);
        done();
      });
    });
  });

  describe('quizes.get', function() {
    it('send my private quiz by id', function(done) {
      const quiz = Factory.create('quiz', { private: true });
      const collector = new PublicationCollector({ userId: 'owner' });
      collector.collect('quizes.get', quiz._id, (collections) => {
        expect(collections.quizes.length).to.equal(1);
        done();
      });
    });
    it('send other user public quiz by id', function(done) {
      const quiz = Factory.create('quiz');
      const collector = new PublicationCollector({ userId: 'not-owner' });
      collector.collect('quizes.get', quiz._id, (collections) => {
        expect(collections.quizes.length).to.equal(1);
        done();
      });
    });
    it('send other user private quiz by id', function(done) {
      const quiz = Factory.create('quiz', { private: true });
      const collector = new PublicationCollector({ userId: 'not-owner' });
      collector.collect('quizes.get', quiz._id, (collections) => {
        expect(collections.quizes).to.equal(undefined);
        done();
      });
    });
  });

  describe('quizes.search', function() {
    it('serch quiz from my quizes', function(done) {
      const quiz = Factory.create('quiz', { title: 'title' });
      const collector = new PublicationCollector({ userId: 'owner' });
      collector.collect('quizes.search', 'title', (collections) => {
        expect(collections.quizes.length).to.equal(1);
        done();
      });
    });
    it('serch quizes in my quizes and other user public quizes', function(done) {
      const quizA = Factory.create('quiz', { title: 'title', owner: 'ownerA' });
      const quizB = Factory.create('quiz', { title: 'title', owner: 'ownerB' });
      const collector = new PublicationCollector({ userId: 'ownerA' });
      collector.collect('quizes.search', 'title', (collections) => {
        expect(collections.quizes.length).to.equal(2);
        done();
      });
    });
    it('search other user private quiz', function(done) {
      const quiz = Factory.create('quiz', { title: 'title', private: true });
      const collector = new PublicationCollector({ userId: 'not-owner' });
      collector.collect('quizes.search', 'title', (collections) => {
        expect(collections.quizes).to.equal(undefined);
        done();
      });
    });
    it('search other user public quiz', function(done) {
      const quiz = Factory.create('quiz', { title: 'title' });
      const collector = new PublicationCollector({ userId: 'not-owner' });
      collector.collect('quizes.search', 'title', (collections) => {
        expect(collections.quizes.length).to.equal(1);
        done();
      });
    });
    it('search quiz by tags', function(done) {
      const quiz = Factory.create('quiz', { title: 'title', tags: ['ONE', 'SECOND'] });
      const collector = new PublicationCollector({ userId: 'not-owner' });
      collector.collect('quizes.search', 'SECOND', (collections) => {
        expect(collections.quizes.length).to.equal(1);
        done();
      });
    });
    it('search private quiz by tags', function(done) {
      const quiz = Factory.create('quiz', { title: 'title', tags: ['ONE', 'SECOND'], private: true });
      const collector = new PublicationCollector({ userId: 'not-owner' });
      collector.collect('quizes.search', 'SECOND', (collections) => {
        expect(collections.quizes).to.equal(undefined);
        done();
      });
    });
  });
});
