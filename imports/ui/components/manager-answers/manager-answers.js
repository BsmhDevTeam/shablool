import React from 'react';

const ManagerAnswers = ({ firstAnswer, secondAnswer, thirdAnswer, fourthAnswer }) => (
  <div className="container">
    <div className="row">
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 answers-col">
        <div className="answer-manager-panel-area">
          <div className="panel panel-danger answer-manager-panel">
            <div className="panel-body answer-font-color" id="first-answer">
              <h3><i className="fa fa-heart answer-manager-icon" /></h3>
              <h5>{firstAnswer}</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 answers-col">
        <div className="answer-manager-panel-area">
          <div className="panel panel-info answer-manager-panel">
            <div className="panel-body answer-font-color" id="second-answer">
              <h3><i className="fa fa-circle answer-manager-icon" /></h3>
              <h5>{secondAnswer}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 answers-col">
        <div className="answer-manager-panel-area">
          <div className="panel panel-warning answer-manager-panel">
            <div className="panel-body answer-font-color" id="third-answer">
              <h3><i className="fa fa-square answer-manager-icon" /></h3>
              <h5>{thirdAnswer}</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 answers-col">
        <div className="answer-manager-panel-area">
          <div className="panel panel-success answer-manager-panel">
            <div className="panel-body answer-font-color" id="fourth-answer">
              <h3><i className="fa fa-star answer-manager-icon" /></h3>
              <h5>{fourthAnswer}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );

export default ManagerAnswers;
