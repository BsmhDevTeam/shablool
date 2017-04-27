import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Question } from '../questions/questions';

export const Quizes = new Mongo.Collection('quizes');

const Quize = Class.create({
  name: 'Quize',
  collection: Quizes,
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
    },
    tags: [String],
    user: String,
    questions: [Question],
    private: {
    	type: Boolean,
    	default: false
    },
    createdAt: {
    	type: Date,
    	default() {
				return new Date();
			},
    },
    lastUpdate: {
    	type: Date,
    	default() {
				return new Date();
			},
    }
  },
});