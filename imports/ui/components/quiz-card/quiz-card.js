import React from 'react';

const QuizCard = (props) => (
  <div className="panel panel-defualt">
        <div className="panel-heading">
            <img className="quiz-panel-img" alt="quiz" src="./img/quiz-img/{{ id }}" />
        </div>
        <div className="panel-body">
            <h5 className="quiz-title">{ props.title }</h5>
            <p className="tags-row">
                { props.user }
            </p>
            <p className="tags-row">
                <ul>
                    {props.tags.map(tag => (
                        <li>
                            <label className="tags">{ tag.name }</label>
                        </li>
                    ))}
                </ul>
            </p>
        </div>
        <div className="panel-footer">
            <a href="#" className="btn">העתק שאלון</a>
            <a href="#" className="btn">צפה בפרטים</a>
        </div>
    </div>
);

export default QuizCard;

