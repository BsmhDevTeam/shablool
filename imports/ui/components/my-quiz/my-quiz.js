import React from 'react';

const MyQuiz = ({ quiz }) => {
  const deleteQuiz = () => {
    quiz.delete();
  };

  return (
  <tr>
    <td>
      <p className="summary">{quiz.title}</p>
    </td>
    <td>
      <a href="javascript:;" className="star">
        <i className="glyphicon glyphicon-play" />
      </a>
    </td>
    <td>
      <a className="star" href={`/EditQuiz/${quiz._id}`}>
        <i className="glyphicon glyphicon-pencil" />
      </a>
    </td>
    <td>
      <button className="delete" onClick={deleteQuiz}>
        <i className="glyphicon glyphicon-remove" />
      </button>
    </td>
  </tr>
);
};

export default MyQuiz;
