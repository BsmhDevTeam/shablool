import { assert } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publication.js';
import Quiz from '../quizes.js';

describe('quiz publication', function () {
    beforeEach(function () {
        Quiz.remove({});
        new Quiz({
            title: 'test quiz',
            questions: [],
            tags: ['tag'],
            owner: this.userId,
        }).save();
    });

    describe('quizes.my-quizes', function () {
        it('sends my quizes', function (done) {
            const collector = new PublicationCollector();
            collector.collect('quizes.my-quizes', (collections) => {
                assert.equal(collections.tags.length, 1);
                done();
            });
        });
    });
});
