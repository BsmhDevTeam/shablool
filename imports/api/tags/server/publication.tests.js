// import { assert } from 'meteor/practicalmeteor:chai';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
// import './publication.js';
// import Tag from '../tags.js';

// describe('tags publication', function () {
//     beforeEach(function () {
//         Tag.remove({});
//         new Tag({
//             name: 'test',
//         }).save();
//     });

//     describe('tags.all', function () {
//         it('sends all tags', function (done) {
//             const collector = new PublicationCollector();
//             collector.collect('tags.all', (collections) => {
//                 assert.equal(collections.tags.length, 1);
//                 done();
//             });
//         });
//     });
// });