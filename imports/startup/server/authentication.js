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
      clientId: '3972cd31c474a8cac37c4c75f7cf4592f7014998aab662ee0fe111b674883351',
      loginStyle: 'popup',
      secret: '40726a4ac7a012b52c75e2a062119b6143a9cfdc8461c115680c7d7fbac0a88a',
    },
  },
);

// TODO: configure service before PRODUCTION
