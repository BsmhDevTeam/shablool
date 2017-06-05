import React from 'react';

const PlayersAnswers = ({ firstAnswer, secondAnswer, thirdAnswer, fourthAnswer }) => (
  <div className="container">
    <div className="row">
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col">
        <div className="answer-btn-area">
          <button type="button" className="btn btn-danger answer-button">
            <i className="fa fa-heart answer-icon" />
            <h5>{firstAnswer}</h5>
          </button>
        </div>
      </div>
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col">
        <div className="answer-btn-area">
          <button type="button" className="btn btn-info answer-button">
            <i className="fa fa-circle answer-icon" />
            <h5>{secondAnswer}</h5>
          </button>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col">
        <div className="answer-btn-area">
          <button type="button" className="btn btn-warning answer-button">
            <i className="fa fa-square answer-icon" />
            <h5>{thirdAnswer}</h5>
          </button>
        </div>
      </div>
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 buttons-col">
        <div className="answer-btn-area">
          <button type="button" className="btn btn-success answer-button">
            <i className="fa fa-star answer-icon" />
            <h5>{fourthAnswer}</h5>
          </button>
        </div>
      </div>
    </div>
  </div>
  );

export default PlayersAnswers;
