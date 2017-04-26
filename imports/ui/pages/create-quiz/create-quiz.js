import './create-quiz.html';
import '../../components/question-form/question-form.js';
import uuidV4 from 'uuid/v4';

import { Question } from '../../../api/questions/questions';

import { Answer } from '../../../api/answers/answers';


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
    return () => () => state.set('questions', state.get('questions').filter(i => i !== id));
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
      const answers = [{
          text: form.answer1.value,
          points: form.points1.value,
        },
        {
          text: form.answer2.value,
          points: form.points2.value,
        }, {
          text: form.answer3.value,
          points: form.points3.value,
        }, {
          text: form.answer4.value,
          points: form.points4.value,
        },
      ];
      const quesiton = new Question({
        text: form.question.value,
        answers: answers,
        order: i,
        time: 30,
      });
      return quesiton;
    });
    
    console.log(objs);
  },
});

