import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import layouts
import '../../ui/layouts/game/game';
import '../../ui/layouts/manage/manage';
import ManageLayout from '../../ui/layouts/manage/manage-layout.js';

// Import pages
import '../../ui/pages/home/home';
import '../../ui/pages/not-found/not-found';
import '../../ui/pages/instructions/instructions';
import '../../ui/pages/game-lobby/game-lobby';
import CreateQuiz from '../../ui/pages/create-quiz/create-quiz';
import '../../ui/pages/management/management.js';
import EditQuiz from '../../ui/pages/edit-quiz/edit-quiz';
import '../../ui/pages/search-results/search-results';
import '../../ui/pages/search/search.js';

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
  name: 'Menage.EditQuiz',
  action() {
    mount(ManageLayout, {
      main: <EditQuiz />,
    });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('gameLayout', { main: 'notFound' });
  },
};

FlowRouter.route('/search/:query', {
  name: 'Menage.Search',
  action() {
    BlazeLayout.render('manageLayout', { main: 'Search' });
  },
});
