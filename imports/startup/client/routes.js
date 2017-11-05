
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// Import layouts
import GameLayout from '/imports/ui/layouts/game.js';
import ManageLayout from '/imports/ui/layouts/manage.js';
import LoginLayout from '/imports/ui/layouts/login.js';

// Import pages
import Home from '/imports/ui/pages/game/home';
import Login from '/imports/ui/pages/login/login';
import LoginError from '/imports/ui/pages/login/login-error';
import CreateQuiz from '/imports/ui/pages/manage/my-quizes/create-quiz';
import EditQuiz from '/imports/ui/pages//manage/my-quizes/edit-quiz.js';
import Search from '/imports/ui/pages/search/search.js';
import ViewQuiz from '/imports/ui/pages/search/view-quiz';
import Main from '/imports/ui/pages/manage';
import GameRouter from '/imports/ui/pages/game/router';
import HistoryRouter from '/imports/ui/pages/manage/game-stats-router';
import NotFound from '/imports/ui/pages/not-found/not-found';

const browserHistory = createBrowserHistory();

const verifyLogin = () => {
  if (Meteor.loggingIn() || Meteor.userId()) {
    return;
  }
  return (<Redirect to="/Login" />);
};

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route component={ManageLayout}>
      <Route path="/CreateQuiz" component={CreateQuiz} onEnter={verifyLogin} />
      <Route path="/Manage" component={Main} onEnter={verifyLogin} />
      <Route path="/EditQuiz/:_id" component={EditQuiz} onEnter={verifyLogin} />
      <Route path="/search/:query?" component={Search} onEnter={verifyLogin} />
      <Route path="/ViewQuiz/:_id" component={ViewQuiz} onEnter={verifyLogin} />
    </Route>
    <Route component={LoginLayout}>
      <Route path="/Login" component={Login} />
      <Route path="/LoginError" component={LoginError} />
    </Route>
    <Route component={GameLayout}>
      <Route exact path="/" component={Home} onEnter={verifyLogin} />
      <Route path="/game/:code" component={GameRouter} onEnter={verifyLogin} />
      <Route path="/manage/game/:code" component={HistoryRouter} onEnter={verifyLogin} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default renderRoutes;
