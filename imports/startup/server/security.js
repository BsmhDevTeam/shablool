import { Meteor } from 'meteor/meteor';
import { BrowserPolicy } from 'meteor/browser-policy';
import { GameLogCollection } from '../../api/gamelogs/gamelogs';

Meteor.startup(() => {
  BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
  BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
  BrowserPolicy.content.allowOriginForAll('blob:');
  BrowserPolicy.content.allowOriginForAll('*.cloudflare.com');
  GameLogCollection.rawCollection().createIndex({ 'event.nameType': 1,
    'event.playerId': 1,
    'event.questionId': 1,
    gameId: 1 },
    { unique: true,
      sparse: true });
});
