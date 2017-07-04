import React from 'react';
import PropTypes from 'prop-types';
import ManageNavbar from '../../components/manage-navbar.js';
import OneLinesChart from '../../components/one-line-chart';

const HistoryManager = ({ game }) => (
  <div id="history">
    <div className="row">
      <ManageNavbar />
    </div>
    <div className="row">
      <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2" />

      <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 chart">
        <div className="row">
          <OneLinesChart
            data={game.getAvarageQuestionAndScore()}
            dataKeyX="questionOrder"
            dataKeyY="score"
          />
        </div>
      </div>

      <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2" />
    </div>

    <div className="row">
      <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2" />

      <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 chart">
        <div className="row">
          <OneLinesChart
            data={game.getAvarageQuestionAndTime()}
            dataKeyX="questionOrder"
            dataKeyY="time"
          />
        </div>
      </div>

      <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2" />
    </div>
  </div>
);

HistoryManager.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

export default HistoryManager;
