import React from 'react';

const QuizCard = (props) => {
  const forkQuiz = () => {
    props.quiz.forkQuiz();
  };
  return (
    <div className="panel panel-defualt">
      <div className="panel-heading">
        <img
          className="quiz-panel-img"
          alt="quiz"
          src="./img/quiz-img/{{ id }}"
        />
      </div>
      <div className="panel-body">
        <h5 className="quiz-title">{props.quiz.title}</h5>
        <p className="tags-row">
          {props.quiz.user}
        </p>
        <p className="tags-row">
          <ul>
            {props.quiz.tags.map(tag => (
              <li>
                <label className="tags">{tag.name}</label>
              </li>
            ))}
          </ul>
        </p>
      </div>
      <div className="panel-footer">
        <a href="javascript:void(0)" className="btn" onClick={forkQuiz}>העתק שאלון</a>
        <a href="javascript:void(0)" className="btn">צפה בפרטים</a>
      </div>
    </div>
  );
};

export default QuizCard;
