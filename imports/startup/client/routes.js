import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import layouts
import GameLayout from '../../ui/layouts/game/game.js';
import ManageLayout from '../../ui/layouts/manage/manage.js';

// Import pages
import Home from '../../ui/pages/home/home';
import NotFound from '../../ui/pages/not-found/not-found';

import '../../ui/pages/management/management.js';
<<<<<<< HEAD
import EditQuiz from '../../ui/pages/edit-quiz/edit-quiz';
import '../../ui/pages/search-results/search-results';
import '../../ui/pages/search/search.js';
=======
import Instructions from '../../ui/pages/instructions/instructions';
import GameLobby from '../../ui/pages/game-lobby/game-lobby';
import CreateQuiz from '../../ui/pages/create-quiz/create-quiz';
import EditQuiz from '../../ui/pages/edit-quiz/edit-quiz.js';
import Search from '../../ui/pages/search/search.js';
>>>>>>> 858aca37fcf7c5519d44014c713b206df47be20c

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'Game.Home',
  action() {
    mount(GameLayout, { main: <Home /> });
  },
});

FlowRouter.route('/GameLobby', {
  name: 'Game.GameLobby',
  action() {
    mount(GameLayout, { main: <GameLobby /> });
  },
});

FlowRouter.route('/Instructions', {
  name: 'Game.Instructions',
  action() {
    mount(GameLayout, { main: <Instructions /> });
  },
});

FlowRouter.route('/CreateQuiz', {
  name: 'Manage.CreateQuiz',
  action() {
    mount(ManageLayout, { main: <CreateQuiz /> });
  },
});

FlowRouter.route('/Manage', {
  name: 'Manage.Home',
  action() {
    BlazeLayout.render('manageLayout', { main: 'management' });
  },
});

FlowRouter.route('/EditQuiz/:_id', {
  name: 'Menage.EditQuiz',
  action(params) {
    mount(ManageLayout, { main: <EditQuiz id={params._id} /> });
  },
});

FlowRouter.route('/search/:query', {
  name: 'Manage.Search',
  action() {
<<<<<<< HEAD
    mount(ManageLayout, {
      main: <EditQuiz />,
    });
=======
    mount(ManageLayout, { main: <Search /> });
>>>>>>> 858aca37fcf7c5519d44014c713b206df47be20c
  },
});

FlowRouter.notFound = {
  action() {
    mount(GameLayout, { main: <NotFound /> });
  },
};
