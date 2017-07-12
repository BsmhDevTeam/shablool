import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import Tag from '../tags.js';
import './methods';


describe('tags methods', function () {
    beforeEach(function () {
        Tag.remove({});
        new Tag({
            name: 'bla',
        }).save();
    });

    describe('tags collection', function () {
        it('create correctly', function () {
            const newTag = new Tag({
                name: 'test',
            });
            const id = newTag.create();
            const created = Tag.find({ _id: id });
            const collectionName = created._getCollectionName();
            const count = created.count();

            assert.equal(collectionName, 'tags');
            assert.equal(count, 1);
        });
    });

    describe('tags collection', function () {
        it('delete correctly', function () {
            const newTag = new Tag({
                name: 'test',
            });
            const id = newTag.create();
            const newTagFromDB = Tag.findOne({ _id: id });
            newTagFromDB.delete();
            const created = Tag.find({ _id: id });
            const count = created.count();

            assert.equal(count, 0);
        });
    });

    describe('tags collection', function () {
        it('update correctly', function () {
            const newTag = new Tag({
                name: 'test',
            });
            const id = newTag.create();
            const newTagFromDB = Tag.findOne({ _id: id });
            newTagFromDB.update({ name: 'new name' });
            const updated = Tag.find({ name: 'new name' })
            const count = updated.count();

            assert.equal(count, 1);
        });
    });
});
