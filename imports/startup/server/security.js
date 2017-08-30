import { Meteor } from 'meteor/meteor';
import { BrowserPolicy } from 'meteor/browser-policy';

Meteor.startup(() => {
  BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
  BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
  BrowserPolicy.content.allowOriginForAll('blob:');
  BrowserPolicy.content.allowOriginForAll('*.cloudflare.com');
});
