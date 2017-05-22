import React from 'react';


export default class QurstionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = props.question;
  }

  render() {
    const state = this.state;
    const props = this.props;

    const changeText = (e) => {
      this.setState({ text: e.target.value });
    };

    const changeTime = (e) => {
      this.setState({ time: e.target.value });
    };

    return (
      <div className="form-horizontal">
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="form-group">
              <div className="col-lg-8">
                <input
                  value={state.text}
                  className="form-control input-lg"
                  placeholder="שאל/י שאלה"
                  onChange={changeText}
                />
              </div>
              <div className="col-lg-3">
                <label htmlFor="time" className="control-label col-lg-6">זמן לשאלה:</label>
                <input
                  className="form-control input-lg col-lg-6"
                  value={state.time}
                  onChange={changeTime}
                />
              </div>
              <div className="col-lg-1">
                <button className="btn btn-danger btn-lg" onClick={props.removeQuestion}>
                  <span className="glyphicon glyphicon-minus" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="panel-body">
            {state.answers.map((answer) => {
              const changeAnswer = (e) => {
                const newText = e.target.value;
                const changedAnswers = state.answers.map(a => (a._id !== answer._id ? a : { ...a, text: newText }));
                this.setState({ answers: changedAnswers });
              };

              const changePoints = (e) => {
                const newPoints = e.target.value;
                const changedAnswers = state.answers.map(a => (a._id !== answer._id ? a : { ...a, points: newPoints }));
                this.setState({ answers: changedAnswers });
              };

              return (<RenderAnswer
                key={answer._id}
                answer={answer}
                changeText={changeAnswer}
                changePoints={changePoints}
              />);
            })}
          </div>
        </div>
      </div>
    );
  }
}


const RenderAnswer = ({ answer, changeText, changePoints }) => (
  <div className="form-group">
    <div className="col-lg-9">
      <label htmlFor="answer" className="control-label col-lg-1">1</label>
      <input
        value={answer.text}
        className="form-control col-lg-11"
        placeholder="הכנס/י תשובה"
        onChange={changeText}
      />
    </div>
    <div className="col-lg-3">
      <label htmlFor="points" className="control-label col-lg-4">ניקוד</label>
      <input
        value={answer.points}
        className="form-control col-lg-6"
        onChange={changePoints}
      />
    </div>
  </div>
  );
