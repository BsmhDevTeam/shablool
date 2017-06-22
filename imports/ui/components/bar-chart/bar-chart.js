import React from 'react';
import { BarChart, XAxis, Bar, ResponsiveContainer, Cell } from 'recharts';

const glyphIconsJson = {
  1: 'fa fa-star',
  2: 'fa fa-square',
  3: 'fa fa-circle',
  4: 'fa fa-heart',
};

const colorsJson = {
  1: '#1668cb',
  2: '#e21c3f',
  3: '#2b8d12',
  4: '#d59c04',
};

const AnswerBar = ({ game }) => {
  const data = game.answersGroupCount();

  return (
    <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
      <BarChart data={data}>
        <XAxis dataKey="answerOrder" />
        <Bar dataKey="count" fill="#8884d8">
          {data.map((entry, index) => {
            const color = colorsJson[entry.answerOrder];
            return <Cell fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnswerBar;
