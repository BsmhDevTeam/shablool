import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import layouts
import '../../ui/layouts/game/game.js';
import '../../ui/layouts/manage/manage.js';

// Import pages
import '../../ui/pages/home/home';
import '../../ui/pages/not-found/not-found';
import '../../ui/pages/instructions/instructions';
import '../../ui/pages/game-lobby/game-lobby';
import '../../ui/pages/create-quiz/create-quiz';
import '../../ui/pages/menagement-page/menagement-page.js';
import '../../ui/pages/edit-quiz/edit-quiz.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'Game.home',
  action() {
    BlazeLayout.render('gameLayout', { main: 'home' });
  },
});

FlowRouter.route('/GameLobby', {
  name: 'Game.GameLobby',
  action() {
    BlazeLayout.render('gameLayout', { main: 'gameLobby' });
  },
});

FlowRouter.route('/Instructions', {
  name: 'Game.instructions',
  action() {
    BlazeLayout.render('gameLayout', { main: 'instructions' });
  },
});

FlowRouter.route('/CreateQuiz', {
  name: 'Manage.CreateQuiz',
  action() {
    BlazeLayout.render('manageLayout', { main: 'createQuiz' });
  },
});

FlowRouter.route('/Menage', {
  name: 'Menage.Home',
  action() {
    BlazeLayout.render('manageLayout', { main: 'menagementPage' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('gameLayout', { main: 'notFound' });
  },
};

FlowRouter.route('/EditQuiz/:_id', {
  name: 'Menage.EditQuiz',
  action(params, queryParams) {
    BlazeLayout.render('manageLayout', { main: 'editQuiz' });
  }
});