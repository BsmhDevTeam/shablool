import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

export const Tags = new Mongo.Collection('tags');

const Tag = Class.create({
  name: 'Tag',
  collection: Tags,
  fields: {
    name: {
      type:String,
      validators: [{
        type: 'minLength',
        param: 3
      }, {
        type: 'maxLength',
        param: 40
      }]
    }
  },
});