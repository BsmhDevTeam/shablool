import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
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
  return Meteor.loggingIn() || Meteor.userId();
};

const router = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route
        path="/EditQuiz/:_id"
        render={(props) => (verifyLogin() ? (
          <ManageLayout><EditQuiz id={props.match.params._id} /></ManageLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="/CreateQuiz"
        render={() => (verifyLogin() ? (
          <ManageLayout><CreateQuiz /></ManageLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="/Manage"
        render={() => (verifyLogin() ? (
          <ManageLayout><Main /></ManageLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="/search/:query?"
        render={(props) => (verifyLogin() ? (
          <ManageLayout><Search query={props.match.params.query} /></ManageLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="/ViewQuiz/:_id"
        render={(props) => (verifyLogin() ? (
          <ManageLayout><ViewQuiz id={props.match.params._id} /></ManageLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="/Statistic/:code"
        render={(props) => (verifyLogin() ? (
          <ManageLayout><HistoryRouter code={props.match.params.code} /></ManageLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="/Login"
        render={() => (!verifyLogin() ? (
          <LoginLayout><Login /></LoginLayout>
        ) : (
          <Redirect to="/" />
        ))}
      />
      <Route
        path="/LoginError"
        render={() => (!verifyLogin() ? (
          <LoginLayout><LoginError /></LoginLayout>
        ) : (
          <Redirect to="/" />
        ))}
      />
      <Route
        exact
        path="/"
        render={() => (verifyLogin() ? (
          <GameLayout><Home /></GameLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="/game/:code"
        render={(props) => (verifyLogin() ? (
          <GameLayout><GameRouter code={props.match.params.code} /></GameLayout>
        ) : (
          <Redirect to="/Login" />
        ))}
      />
      <Route
        path="*"
        render={() => <GameLayout><NotFound /></GameLayout>}
      />
    </Switch>
  </Router>
);

Meteor.startup(() => {
  render(router(), document.getElementById('app'));
});
