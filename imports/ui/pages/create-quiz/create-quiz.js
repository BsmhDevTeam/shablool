import './create-quiz.html';
import '../../components/question-form/question-form.js';
import uuidV4 from 'uuid/v4';


Template.create_quiz.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    questions: [uuidV4()],
  });
});

Template.create_quiz.helpers({
  questions() {
    const instance = Template.instance();
    return instance.state.get('questions');
  },
  removeQuestion(id) {
    const state = Template.instance().state;
    return () => () => state.set('questions', state.get('questions').filter(i => i!==id));
  }
});

Template.create_quiz.events({
  'click .add-question' (event, instance) {
    const questions = instance.state.get('questions');
    instance.state.set('questions', [...questions, uuidV4()]);
  },
  'click .save-quiz' (event, instance) {
    const forms = instance.$('.question-form');

    const objs = forms.map((i, form) => {
      return {
        q: form.question.value,
        as: [form.answer1.value, form.answer2.value, form.answer3.value, form.answer4.value]
      }
    });
  },
});