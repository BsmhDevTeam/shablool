import React from 'react';
import Loading from '../../components/loading/loading';

const AnswerSent = () => (
  <div id="answer-sent">
    <div className="game-background" />
    <div className="row">
      <h1>תשובתך נשלחה בהצלחה !</h1>
    </div>
    <div className="row">
      <div className="col-xl-2 col-xl-offset-5 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
        <div>
          <Loading />
        </div>
      </div>
    </div>
  </div>
);

export default AnswerSent;
