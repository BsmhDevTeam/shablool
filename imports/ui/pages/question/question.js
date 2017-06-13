import Meteor from 'meteor/meteor';
import React from 'react';
import Answers from '../../components/answers/answers';
import Game from '../../../api/games/games.js';
import GameNavbar from '../../components/game-navbar/game-navbar';
import BarChart from '../../components/bar-chart/bar-chart';

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



const Question = ({ question }) => {
  const selectAnswer = (aId) => {
    Game.PlayerAnswer(Meteor.user().id, question._id, aId);
  };

  const actions = {
    selectAnswer,
  };
  return (
    <div id="question">
      <div className="container">
        <div className="row">
          <GameNavbar text={question.text} num={question.order} />
        </div>
        <div className="row">
          <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <CountdownTimer secondsRemaining={question.time} />
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            {<BarChart answers={Game.answersGroupCount()} />}
          </div>
          <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <p className="answer-count" id="answer-count-number">{Game.answerCount()}</p>
            <p className="answer-count">Answers</p>
          </div>
        </div>
        <Answers
          answers={question.answers}
          actions={actions}
        />
      </div>
    </div>
  );
};

export default Question;
