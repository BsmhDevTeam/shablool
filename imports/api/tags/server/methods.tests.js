import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import Tag from '../tags.js';


describe('links collection', function () {
    it('insert correctly', function () {
        const newTag = new Tag({
            name: 'test',
        });
        newTag.save();
        const added = Tag.find({ _id: newTag._id });
        const collectionName = added._getCollectionName();
        const count = added.count();

        assert.equal(collectionName, 'tags');
        assert.equal(count, 1);
    });
});
