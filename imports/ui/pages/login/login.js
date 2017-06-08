import React from 'react';
import { Meteor } from 'meteor/meteor';
import LoginButtons from '../../components/login-buttons/login-buttons.js';

const Login = () => {
  console.log(Meteor.user());
  const login = () => {
    Meteor.loginWithGithub((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(Meteor.user());
      }
    });
  };
  return (
    <div id="login">
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
