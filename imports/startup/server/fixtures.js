// // Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
<<<<<<< HEAD
import Quizes from '../../api/quizes/quizes.js';
import Tags from '../../api/tags/tags.js';
=======
import uuidV4 from 'uuid/v4';
import Quiz from '../../api/quizes/quizes.js';
import Tag from '../../api/tags/tags.js';
>>>>>>> 858aca37fcf7c5519d44014c713b206df47be20c

Meteor.startup(() => {
  let tagsId = [];

  if (Tags.find().count() === 0) {
    const tags = [{
      name: 'loops',
    },
    {
      name: 'while',
    },
    {
      name: 'for',
    },
    ];

    tagsId = tags.map(tag => Tags.insert(tag));
  }

  if (Quizes.find().count() === 0) {
    const quizes = [{
      title: 'Loops',
      questions: [{
        _id: uuidV4(),
        text: 'מתי נשתמש בלולאות?',
        answers: [{
          _id: uuidV4(),
          text: 'אף פעם',
          points: 0,
        },
        {
          _id: uuidV4(),
          text: 'תמיד',
          points: 0,
        },
        {
          _id: uuidV4(),
          text: 'קוד חוזר',
          points: 2,
        }],
        order: 1,
        time: 30,
        createdAt: new Date(),
        lastUpdate: new Date(),
      },
      ],
      tags: tagsId,
      user: '8142023',
      private: false,
      createdAt: new Date(),
      lastUpdate: new Date(),
    }];

    quizes.map(quiz => Quizes.insert(quiz));
  }
});
