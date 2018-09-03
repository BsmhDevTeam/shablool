import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withRouter, Link } from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameError: false,
      passwordError: false,
    };
  }

  render() {
    const updateStateErrors = (e) => {
      switch (e.reason) {
        case 'User not found':
          this.setState({ usernameError: true });
          this.setState({ passwordError: false });
          break;
        case 'Incorrect password':
          this.setState({ usernameError: false });
          this.setState({ passwordError: true });
          break;
        default:
          break;
      }
    };
    const loginAction = (isFormValid, username, password) => isFormValid ? Meteor.loginWithPassword
                (username, password, ((e) => {
                  e ? updateStateErrors(e) : null;
                })) : null;
    const goHome = () => Meteor.userId() ? this.props.history.push('/') : null;
    const login = (e) => {
      e.preventDefault();
      const password = e.target.password.value;
      const username = e.target.username.value;
      const isFormValid = username && password;
      loginAction(isFormValid, username, password);
      Meteor.setTimeout(goHome, 800);
    };

    return (
      <div id="login">
        <div className="login-background" />
        <form onSubmit={login}>
          <h1>התחבר לשבלול</h1>
          <div className={`form-group ${this.state.usernameError ? 'has-error' : ''}`}>
            <label htmlFor="username" className="sr-only">שם משתמש</label>
            <input type="text" name="username" id="username" className="form-control" placeholder="שם משתמש" required />
            { this.state.usernameError ? <span className="help-block">שם זה אינו קיים במערכת</span> : '' }
          </div>
          <div className={`form-group ${this.state.passwordError ? 'has-error' : ''}`}>
            <label htmlFor="password" className="sr-only">סיסמה</label>
            <input type="password" name="password" id="password" className="form-control" placeholder="סיסמה" required />
            { this.state.passwordError ? <span className="help-block">סיסמה שגויה</span> : '' }
          </div>
          <input type="submit" id="btn-login" className="btn btn-custom btn-lg btn-block" value="התחבר!" />
        </form>
        <div className="link-message">עדיין אין לך משתמש בשבלול?
          <Link to={{ pathname: '/Register', props: { history: this.props.history } }}>הצטרף!</Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
