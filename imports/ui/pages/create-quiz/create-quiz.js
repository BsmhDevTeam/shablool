import React from 'react';
import uuidV4 from 'uuid/v4';

import './create-quiz.html';

import '../../components/question-form/question-form.js';
import '../../components/tag-template/tag-template.js';

import { Tag } from '../../../api/tags/tags';
import Quiz from '../../../api/quizes/quizes';

// Utilities
const normalizeTagName = str =>
  [str]
    .map(s => s.trim())
    .map(s => s.toLocaleLowerCase())
    .map(s => s.replace(/\s+/g, '-'))
    .pop();

// React Page
export default class HelloWorld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [uuidV4()],
      tags: [],
    };
  }

  render() {
    return (
      <div id="create-quiz">
    		<div class="row">
    			<div class="col-sm-12">
    				<div class="page-header">
    					<input type="text" class="input-title form-control" placeholder="כותרת שאלון" />
    				</div>
    			</div>
    		</div>
    		{{#each questionId in questions}}
    		<div class="row">
    			<div class="col-sm-12">
    				{{> questionForm removeQuestion=(removeQuestion questionId)}}
    			</div>
    		</div>
    		{{/each}}
    		<div class="row">
    			<div class="col-sm-12">
    				<button class="add-question btn btn-primary btn-lg btn-block"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
    			</div>
    		</div>
    		<hr />
    		<div class="row">
    			<div class="col-sm-9">
    				<div class="row">
    					<div class="col-lg-4">
    						<form class="tags-form">
    							<label for="tag" class="control-label">הוספת תגיות</label>
    							<input name="tag" class="form-control input-lg" type="text">
    						</form>
    					</div>
    					<div class="col-lg-8">
    						{{#each tag in tags}}
    							{{> tagTemplate tag=tag removeTag=(removeTag tag.id)}}
    						{{/each}}
    					</div>
    				</div>
    			</div>
    			<div class="col-sm-3">
    				<div class="form-group-lg">
    					<label for="isPrivate" class="control-label">מי יכול למצוא את השאלון</label>
    					<select name="isPrivate" class="is-private form-control">
    						<option value="false">כולם</option>
    						<option value="true">רק אני</option>
    					</select>
    				</div>
    			</div>
    		</div>
    		<hr />
    		<div class="row">
    			<div class="col-sm-12">
    				<button type="button" class="save-quiz btn btn-success btn-lg col-sm-2 pull-left"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>
    			</div>
    		</div>
    	</div>
    );
  }
}


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
    console.log(questions);
    templateInstance.state.set('questions', [...questions, uuidV4()]);
  },

  'click .save-quiz'(event, templateInstance) {
    // get quiz title
    const title = templateInstance.$('.input-title');

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


    console.log(title);
    // create quiz
    const quiz = new Quiz({
      title: title,
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
      name: normalizeTagName(tagName),
    };

    const tags = templateInstance.state.get('tags');
    templateInstance.state.set('tags', [...tags, tag]);

    // clear input field
    input.tag.value = '';
  },
});
