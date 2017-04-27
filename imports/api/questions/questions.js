import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';
import { Answer } from '../answers/answers.js'

const Questions = new Mongo.Collection('questions');

export const Question = Class.create({
	name: 'Question',
	collection: Questions,
	fields: {
		text: {
			type: String,
			validators: [{
				type: 'minLength',
				param: 3
			}, {
				type: 'maxLength',
				param: 300
			}]
		},
		answers: [Answer],
		order: Number,
		time: Number,
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