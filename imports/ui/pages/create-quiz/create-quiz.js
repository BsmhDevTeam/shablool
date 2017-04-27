import uuidV4 from 'uuid/v4';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './create-quiz.html';


import '../../components/question-form/question-form.js';
import '../../components/tag-template/tag-template.js';

import { Tag } from '../../../api/tags/tags';
import Quiz from '../../../api/quizes/quizes';

Template.create_quiz.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    questions: [uuidV4()],
    tags: [],
  });
});

Template.create_quiz.helpers({
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

Template.create_quiz.events({
  'click .add-question'(event, instance) {
    const questions = instance.state.get('questions');
    instance.state.set('questions', [...questions, uuidV4()]);
  },
  'click .save-quiz'(event, instance) {
    // get quiz title
    const title = instance.$('.input-title').value;

    // get quiestions
    const forms = instance.$('.question-form');
    const questions = forms.map((i, form) => {
      const answers = [
        {
          text: form.answer1.value,
          points: form.points1.value,
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
        time: 30,
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
    const tags = instance.state.get('tags');
    const tagsId = tags.map((t) => {
      // check if tag exists
      const newTag = { name: t.name };
      const existTag = Tag.findOne(newTag); // TODO: better duplication checks
      return existTag ? existTag._id : new Tag(newTag).create();
    });
  },
  'submit .tags-form'(event, instance) {
    event.preventDefault();
    const tagName = event.target.tag.value;
    const tag = {
      id: uuidV4(),
      name: stantartizeTagName(tagName),
    };

    const tags = instance.state.get('tags');
    instance.state.set('tags', [...tags, tag]);

    // clear input field
    event.target.tag.value = '';
  },
});

const stantartizeTagName = s =>
  [s]
    .map(str => str.trim())
    .map(str => str.toLocaleLowerCase())
    .map(str => str.replace(/\s+/g, '-'))
    .pop();
