import { ServiceConfiguration } from 'meteor/service-configuration';

ServiceConfiguration.configurations.upsert(
  { service: 'github' },
  {
    $set: {
      clientId: '09eb4c188eadb9503077',
      loginStyle: 'popup',
      secret: '5581151c7e0942bf1b51faa555de3a354d2c7969',
    },
  },
);

ServiceConfiguration.configurations.upsert(
  { service: 'gitlab' },
  {
    $set: {
      clientId: 'ff52b1cbd45605f4b2a7c35d5eb48e7defb73c668423a049010fb5dbc02d56ae',
      loginStyle: 'popup',
      secret: '93e74d0b5d65ba9ad097667faead43624ddae328c65558409eb8df2782f99aea',
    },
  },
);
