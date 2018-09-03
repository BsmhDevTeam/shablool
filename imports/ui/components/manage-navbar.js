import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, withRouter } from 'react-router-dom';

class ManageNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(), 
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      60000, // 1 minute
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    const search = (e) => {
      e.preventDefault();
      const query = e.target.query.value;
      this.props.history.push(`/search/${query}`);
    };
    const getWelcomeByHours = () => {
      const now = new Date();
      const hour = now.getHours();
      switch (true) {
        case hour >= 22:
          return 'לילה טוב';
        case hour >= 0 && hour < 6:
          return 'לילה טוב';
        case hour >= 6 && hour < 12:
          return 'בוקר טוב';
        case hour >= 12 && hour < 15:
          return 'צהריים טובים';
        case hour >= 15 && hour < 18:
          return 'אחר הצהריים טובים';
        case hour >= 18 && hour < 22:
          return 'ערב טוב';
        default:
          return 'שלום';
      }
    };
    return (
      <nav className="navbar navbar-default navbar-fixed-top manage-navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#manage-nav"
              aria-expanded="false"
            >
              <span className="sr-only" />
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link to="/" className="navbar-brand navbar-link-element">
              <img className="small-logo" src="/img/SmallLogoWhite.svg" alt="logo" />
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="manage-nav">
            <form className="js-search navbar-form navbar-right" role="search" onSubmit={search}>
              <div className="form-group">
                <input className="form-control" placeholder="חפש שאלון" name="query" type="text" />
              </div>
              <button type="submit" className="btn btn-default">
                <span className="glyphicon glyphicon-search" />
              </button>
            </form>
            <ul className="nav navbar-nav navbar-left">
              <li className="manage-nav-li">
                <Link to="/Manage" className="navbar-link-element">
                  <span>
                    {getWelcomeByHours()}, {Meteor.user().username}{' '}
                  </span>
                  <span className="glyphicon glyphicon-user" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(ManageNavBar);
