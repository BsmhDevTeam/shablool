import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

const Login = () => {
  const login = () => {
    Meteor.loginWithGithub(
      err => (err ? FlowRouter.go('Game.LoginError') : FlowRouter.go('Game.Home')),
    );
  };

  const isAlreadyLoggedIn = Meteor.loggingIn() || Meteor.userId();
  if (isAlreadyLoggedIn) FlowRouter.go('Game.Home');

  return (
    <div id="login">
      <div className="game-background" />
      <div className="container">
        <div className="row">
          <div className="col-md-4" />
          <div className="col-md-4">
            <button className="btn btn-lg btn-warning btn-block" onClick={login}>
              Login
              <i className="fa fa-gitlab" aria-hidden="true" />
            </button>
          </div>
          <div className="col-md-4" />
        </div>
      </div>
    </div>
  );
};

export default Login;
