import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import uuidV4 from 'uuid/v4';

import './create-quiz.html';

import '../../components/question-form/question-form.js';
import '../../components/tag-template/tag-template.js';

import { Tag } from '../../../api/tags/tags';
import Quiz from '../../../api/quizes/quizes';



// Utilities
const stantartizeTagName = s =>
  [s]
    .map(str => str.trim())
    .map(str => str.toLocaleLowerCase())
    .map(str => str.replace(/\s+/g, '-'))
    .pop();


// On Create
Template.createQuiz.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    questions: [uuidV4()],
    tags: [],
  });
});


// Template Helpers
Template.createQuiz.helpers({
  questions() {
    const instance = Template.instance();
    return instance.state.get('questions');
  },
  removeQuestion(id) {
    const state = Template.instance().state;
    return () => () =>
      state.set('questions', state.get('questions').filter(i => i !== id));
  },
  tags() {
    const instance = Template.instance();
    return instance.state.get('tags');
  },
  removeTag(id) {
    const state = Template.instance().state;
    return () => () =>
      state.set('tags', state.get('tags').filter(tag => tag.id !== id));
  },
});


// Events
Template.createQuiz.events({
  'click .add-question'(event, templateInstance) {
    const questions = templateInstance.state.get('questions');
    templateInstance.state.set('questions', [...questions, uuidV4()]);
  },
  'click .save-quiz'(event, templateInstance) {
    // get quiz title
    const title = templateInstance.$('.input-title').value;

    // get quiestions
    const forms = templateInstance.$('.question-form');
    const questions = forms.map((i, form) => {
      const answers = [
        {
          text: form.answer1.value,
          points: parseInt(form.points1.value, 10),
        },
        {
          text: form.answer2.value,
          points: parseInt(form.points2.value, 10),
        },
        {
          text: form.answer3.value,
          points: parseInt(form.points3.value, 10),
        },
        {
          text: form.answer4.value,
          points: parseInt(form.points4.value, 10),
        },
      ];
      return {
        text: form.question.value,
        answers,
        order: i,
        time: parseInt(form.time.value, 10),
      };
    });

    // create quiz
    const quiz = new Quiz({
      title,
      questions,
    });

    // validate quiz
    quiz.validate((e) => {
      console.log(e);
    });

    // get tags
    const tags = templateInstance.state.get('tags');
    const tagsId = tags.map((t) => {
      // check if tag exists
      const newTag = { name: t.name };
      const existTag = Tag.findOne(newTag); // TODO: better duplication checks
      return existTag ? existTag._id : new Tag(newTag).save();
    });
  },
  'submit .tags-form'(event, templateInstance) {
    event.preventDefault();
    const input = event.target;
    const tagName = input.tag.value;
    const tag = {
      id: uuidV4(),
      name: stantartizeTagName(tagName),
    };

    const tags = templateInstance.state.get('tags');
    templateInstance.state.set('tags', [...tags, tag]);

    // clear input field
    input.tag.value = '';
  },
});
