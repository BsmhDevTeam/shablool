import React from 'react';
import ManageNavbar from '../../components/manage-navbar.js';
import QuestionScoreLineChart from '../../components/question-score-line-chart';

const HistoryPlayer = ({ game }) => (
  <div id="history-player">
    <div className="row">
      <ManageNavbar />
    </div>
    <div className="row">
      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" />

      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 padding-top">
        <div className="row">
          <h3>הציון שלי לעומת שאר הכיתה</h3>
        </div>
        <div className="row">
          <QuestionScoreLineChart game={game} />
        </div>
      </div>

      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" />
    </div>
  </div>
);

export default HistoryPlayer;
