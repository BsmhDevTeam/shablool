import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import layouts
import GameLayout from '../../ui/layouts/game/game.js';
import ManageLayout from '../../ui/layouts/manage/manage.js';

// Import pages
import Home from '../../ui/pages/home/home';
import '../../ui/pages/not-found/not-found';
import '../../ui/pages/instructions/instructions';
import '../../ui/pages/game-lobby/game-lobby';
import CreateQuiz from '../../ui/pages/create-quiz/create-quiz';
import '../../ui/pages/management/management.js';
import '../../ui/pages/edit-quiz/edit-quiz.js';
import '../../ui/pages/search-results/search-results';
import '../../ui/pages/search/search.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'Game.Home',
  action() {
    mount(GameLayout, {
      main: <Home />,
    });
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
    mount(ManageLayout, {
      main: <CreateQuiz />,
    });
  },
});

FlowRouter.route('/Manage', {
  name: 'Manage.Home',
  action() {
    BlazeLayout.render('manageLayout', { main: 'management' });
  },
});

FlowRouter.route('/SearchResults', {
  name: 'Manage.SearchResults',
  action() {
    BlazeLayout.render('manageLayout', { main: 'searchResults' });
  },
});

FlowRouter.route('/EditQuiz/:_id', {
  name: 'Manage.EditQuiz',
  action() {
    BlazeLayout.render('manageLayout', { main: 'editQuiz' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('gameLayout', { main: 'notFound' });
  },
};

FlowRouter.route('/search/:query', {
  name: 'Manage.Search',
  action() {
    BlazeLayout.render('manageLayout', { main: 'Search' });
  },
});
