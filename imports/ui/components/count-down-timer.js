import React from 'react';
import PropTypes from 'prop-types';

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secondsRemaining: props.secondsRemaining,
    };

    const tick = () => {
      this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
      if (this.state.secondsRemaining <= 0) {
        clearInterval(this.interval);
      }
    };

    this.interval = setInterval(tick, 1000);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  render() {
    return (
      <p className="count-down-timer-num">
        {this.state.secondsRemaining}
      </p>
    );
  }
}

CountdownTimer.propTypes = {
  secondsRemaining: PropTypes.number.isRequired,
};

export default CountdownTimer;
