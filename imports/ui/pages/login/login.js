import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LoginButtons from '../../components/login-buttons/login-buttons.js';

const Login = () => {
  const login = () => {
    Meteor.loginWithGithub((err) => {
      if (err) {
        FlowRouter.go('/LoginError');
      } else {
        FlowRouter.go('/');
      }
    });
  };
  return (
    <div id="login">
      <div className="game-background" />
      <div className="container">
        <div className="row">
          <div className="col-md-4" />
          <div className="col-md-4">
            <LoginButtons login={login} />
          </div>
          <div className="col-md-4" />
        </div>
      </div>
    </div>
  );
};

export default Login;
