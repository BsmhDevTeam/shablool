import React from 'react';
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

  const CustomizedAxisTick = ({ x, y, stroke, payload }) => (
    <g transform={`translate(${x + 9.5},${y + 15})`}>
      <text
        dangerouslySetInnerHTML={{
          __html: `&#x${glyphIconsJson[payload.value]};`,
        }}
      />
    </g>
  );

  const CustomizedLabel = ({ x, y, fill, value }) => {
    console.log('x:');
    console.log(x);
    console.log('y:');
    console.log(y);
    console.log('fill:');
    console.log(fill);
    console.log('value:');
    console.log(value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={x}
          y={y}
          fontSize="16"
          fontFamily="sans-serif"
          fill={fill}
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
      <BarChart data={data}>
        <XAxis
          dataKey="answerOrder"
          axisLine={false}
          tickLine={false}
          tick={<CustomizedAxisTick />}
        />
        <Bar dataKey="count" label={<CustomizedLabel />}>
          {data.map((entry, index) => {
            const color = colorsJson[entry.answerOrder];
            return <Cell fill={color} key={entry.answerOrder} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnswerBar;
