import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, Bar, ResponsiveContainer, Cell } from 'recharts';

const glyphIconsJson = {
  1: 'f005',
  2: 'f0c8',
  3: 'f111',
  4: 'f004',
};

const colorsJson = {
  1: '#1668cb',
  2: '#e21c3f',
  3: '#2b8d12',
  4: '#d59c04',
};

const AnswerBar = ({ game }) => {
  const data = game.answersGroupCount();

  const CustomizedAxisTick = ({ x, y, payload }) =>
    <g transform={`translate(${x + 9.5},${y + 15})`}>
      <text
        dangerouslySetInnerHTML={{
          __html: `&#x${glyphIconsJson[payload.value]};`,
        }}
      />
    </g>;
  CustomizedAxisTick.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    payload: PropTypes.instanceOf(Object),
  };
  return (
    <ResponsiveContainer width="100%" aspect={5.0 / 3.0}>
      <BarChart data={data} margin={{ top: 30 }}>
        <XAxis
          dataKey="answerOrder"
          axisLine={false}
          tickLine={false}
          tick={<CustomizedAxisTick />}
        />
        <Bar dataKey="count">
          {data.map((entry, index) => {
            const color = colorsJson[entry.answerOrder];
            return <Cell fill={color} key={entry.answerOrder} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

AnswerBar.propTypes = {
  game: PropTypes.instanceOf(Object).isRequired,
};

export default AnswerBar;
