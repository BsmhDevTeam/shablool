import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
  BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
  BrowserPolicy.content.allowEval('https://ajax.googleapis.com');
  BrowserPolicy.content.allowOriginForAll('blob:');
});
