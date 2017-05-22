import React from 'react';
import MyQuiz from '../../components/my-quiz/my-quiz.js';
import Quiz from '../../../api/quizes/quizes';

export default class Management extends React.Component {
  render() {
    const deleteQuiz = quiz => () => {
      quiz.delete();
    };

    const props = { quizes: Quiz.find() };
	    return (
  <div id="quizes">
    <div>
      <div className="card">
        <div className="btn-pref btn-group btn-group-justified btn-group-lg" role="group" aria-label="...">
          <div className="btn-group" role="group">
            <button type="button" id="stars" className="btn btn-primary" href="#tab1" data-toggle="tab">
              <span className="glyphicon glyphicon-list-alt" aria-hidden="true" />
              <div className="hidden-xs">השאלונים שלי</div>
            </button>
          </div>
          <div className="btn-group" role="group">
            <button type="button" id="favorites" className="btn btn-default" href="#tab2" data-toggle="tab">
              <span className="glyphicon glyphicon-stats" aria-hidden="true" />
              <div className="hidden-xs">התוצאות שלי</div>
            </button>
          </div>
          <div className="btn-group" role="group">
            <button type="button" id="following" className="btn btn-default" href="#tab3" data-toggle="tab">
              <span className="glyphicon glyphicon-user" aria-hidden="true" />
              <div className="hidden-xs">ניהול קבוצות</div>
            </button>
          </div>
        </div>
      </div>
      <div className="well">
        <div className="tab-content">
          <div className="tab-pane fade in active" id="tab1">
            <h3>השאלונים שלי</h3>
            <a href="/CreateQuiz" className="add-question btn btn-primary btn-lg btn-block">שאלון חדש</a>
            <table className="table table-filter">
              <tbody>
                {props.quizes.map(quiz => 
                  <MyQuiz questions={quiz.questions} deleteQuiz={deleteQuiz(quiz)} />,
                )};
              </tbody>
            </table>
          </div>
          <div className="tab-pane fade in" id="tab2">
            <h3>כאן יהיו תוצאות המשחקים</h3>
          </div>
          <div className="tab-pane fade in" id="tab3">
            <h3>כאן ניצור קבוצות</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
  }
}
