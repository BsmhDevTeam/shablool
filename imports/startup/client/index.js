// Import client startup through a single index entry point
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import router from './routes.js';

Meteor.startup(() => {
  render(router(), document.getElementById('app'));
});
