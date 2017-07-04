import { Meteor } from 'meteor/meteor';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { expect } from 'chai';
import uuidV4 from 'uuid/v4';

if (Meteor.isServer) {
  describe('publication', function() {
    it('should publish 10 documents', function(done) {
      const collector = new PublicationCollector({ userId: uuidV4() });

      collector.collect('publications', (collections) => {
        chai.assert.equal(collections.quizes.length, 10);
        done();
    });
  });
});
}
