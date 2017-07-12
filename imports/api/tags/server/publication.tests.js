import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publication.js';
import Tag from '../tags.js';

describe('tags publication', function () {
    beforeEach(function () {
        Tag.remove({});
        new Tag({
            _id: 'tag1',
            name: 'name1',
        }).save();
        new Tag({
            _id: 'tag2',
            name: 'name2',
        }).save();
        new Tag({
            _id: 'tag3',
            name: 'name3',
        }).save();
        new Tag({
            _id: 'tag4',
            name: 'name4',
        }).save();
    });


    describe('tags.all', function () {
        it('sends my quizes', function (done) {
            const collector = new PublicationCollector({ userId: 'me' });
            collector.collect('tags.all', (collections) => {
                assert.equal(collections.tags.length, 4);
                done();
            });
        });
    });
});
