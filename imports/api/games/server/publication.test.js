import { Meteor } from 'meteor/meteor';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Factory } from 'meteor/dburles:factory';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publication.js';

const asUser = (user) => {
  Meteor.userId.restore();
  sinon.stub(Meteor, 'userId', function() {
    return user; // User id
  });
};

describe('Game Publications', function() {
  beforeEach(function() {
    sinon.stub(Meteor, 'userId', function() {
      return 'owner'; // User id
    });
  });

  afterEach(function() {
    Meteor.userId.restore();
    resetDatabase();
  });

  describe('games.get-by-code', function() {
    it('should allow subscription to games I own', function(done) {
      const game = Factory.create('game');
      const collector = new PublicationCollector({ userId: 'owner' });
      collector.collect('games.get-by-code', game.code, (collections) => {
        expect(collections.games.length).to.equal(1);
        done();
      });
    });
    it('should allow subscription to games I participate in', function(done) {
      const game = Factory.create('game');
      game.gameStart();
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      const collector = new PublicationCollector({ userId: 'player' });
      collector.collect('games.get-by-code', game.code, (collections) => {
        expect(collections.games.length).to.equal(1);
        done();
      });
    });
    it('should not allow subscription to games I do not own or participate in', function(done) {
      const game = Factory.create('game');
      const collector = new PublicationCollector({ userId: 'player' });
      collector.collect('games.get-by-code', game.code, (collections) => {
        expect(collections.games).to.equal(undefined);
        done();
      });
    });
  });

  describe('games.games-managed', function() {
    it('should get all closed games owned by me', function(done) {
      const game = Factory.create('game');
      game.gameStart();
      game.closeGame();
      const collector = new PublicationCollector({ userId: 'owner' });
      collector.collect('games.games-managed', (collections) => {
        expect(collections.games.length).to.equal(1);
        done();
      });
    });
  });

  describe('games.games-played', function() {
    it('should get all closed games I participated in', function(done) {
      const game = Factory.create('game');
      asUser('owner');
      game.gameStart();
      asUser('player');
      Meteor.call('joinGame', { code: game.code });
      asUser('owner');
      game.closeGame();
      const collector = new PublicationCollector({ userId: 'player' });
      collector.collect('games.games-played', (collections) => {
        expect(collections.games.length).to.equal(1);
        done();
      });
    });
  });
});
