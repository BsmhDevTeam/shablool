import React from 'react';

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
    return <h1>{this.state.secondsRemaining}</h1>;
  }
}

export default CountdownTimer;
