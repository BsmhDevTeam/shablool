import React from 'react';
import Loading from '/imports/ui/components/loading';

const AnswerSent = () => (
  <div id="answer-sent">
    <div className="game-background" />
    <div className="row">
      <div id="title">
        <h1>תשובתך נשלחה בהצלחה !</h1>
      </div>
    </div>
    <div className="row">
      <div className="col-xl-2 col-xl-offset-5 col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
        <div>
          <Loading color={'white'} />
        </div>
      </div>
    </div>
  </div>
);

export default AnswerSent;
