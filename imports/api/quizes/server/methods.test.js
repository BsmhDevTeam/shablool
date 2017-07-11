import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import Quiz from '../quizes.js';
import './methods';


describe('quizes methods', function () {
    beforeEach(function () {
        Quiz.remove({});
        new Quiz({
            title: 'test quiz',
            questions: [],
            tags: ['tag'],
            owner: 'Me',
        }).save();
    });

    describe('Quizes collection', function () {
        it('create correctly', function () {
            const newQuiz = new Quiz({
                title: 'test quiz',
                questions: [],
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

    describe('Quizes collection', function () {
        it('delete correctly', function () {
            const newQuiz = new Quiz({
                title: 'test quiz',
                questions: [],
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

    describe('Quizes collection', function () {
        it('update correctly', function () {
            const newQuiz = new Quiz({
                title: 'test quiz',
                questions: [],
                tags: ['tag'],
                owner: 'Me',
            });
            const id = newQuiz.create();
            const newQuizFromDB = Quiz.findOne({ _id: id });
            newQuizFromDB.update({ title: 'new title', tags: ['new tag'] });
            const updated = Quiz.find({ title: 'new title', tags: ['new tag'] })
            const count = updated.count();

            assert.equal(count, 1);
        });
    });
});
