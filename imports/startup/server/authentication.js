import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';


ServiceConfiguration.configurations.upsert(
  { service: 'gitlab' },
  {
    $set: Meteor.settings.auth.gitlab,
  },
);
