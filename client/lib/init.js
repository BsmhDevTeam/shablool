// uuid using Buffer (node module) on the client and so we need to add Buffer to the global env
global.Buffer = global.Buffer || require('buffer').Buffer;
