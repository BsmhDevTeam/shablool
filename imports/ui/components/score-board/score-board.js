import React from 'react';

const ScoreBoard = ({scoreList}) => (
  <table className="table">
    <tbody>
        <tr>
          {scoreList.map(s => (
            <td>{Object.keys(s)}</td>
            <td>{s[0]}</td>
          ))}
        </tr>
    </tbody>
  </table>
);

export default ScoreBoard;