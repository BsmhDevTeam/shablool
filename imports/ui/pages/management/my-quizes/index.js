import React from 'react';
import PropTypes from 'prop-types';
import QuizCard from '/imports/ui/components/quiz-card';
import { managementTabs } from '/imports/startup/both/constants.js';

const MyQuizes = ({ activeTab, myQuizes, actions }) =>
  <div className={`tab-pane fade in ${activeTab === managementTabs.myQuizes ? 'active' : ''}`}>
    <div className="row">
      <a href="/CreateQuiz" className="add-question">
        <div className="panel panel-default" id="add-quiz-panel">
          <div className="panel-body">
            <span className="glphicon glyphicon-plus" id="add-quiz-plus-icon" />
          </div>
        </div>
      </a>
    </div>
    {myQuizes.length
      ? myQuizes.map(quiz =>
        <div className="row" key={quiz._id}>
          <QuizCard quiz={quiz} actions={actions} />
        </div>,
        )
      : <h3>לא יצרת אפילו שאלון אחד, למה אתה מחכה?</h3>}
  </div>;

MyQuizes.propTypes = {
  activeTab: PropTypes.string.isRequired,
  myQuizes: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.instanceOf(Object).isRequired,
};

export default MyQuizes;
