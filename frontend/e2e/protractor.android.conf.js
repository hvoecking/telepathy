const fs = require('fs');
const { SpecReporter } = require('jasmine-spec-reporter');

const env = require('../config/environment.json');
const androidPixel2XLCapability = {
  'app-activity': 'MainActivity',
  'app-package': 'io.ionic.starter',
  app: '/input/app.apk',
  autoAcceptAlerts: 'true',
  autoGrantPermissions: 'true',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  browserName: '',
  deviceName: 'unused',
  newCommandTimeout: 300000,
  platformName: 'Android',
};

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  seleniumAddress: `http://${env.seleniumHost}:${env.seleniumPort}/wd/hub`,
  directConnect: false,
  multiCapabilities: [
    androidPixel2XLCapability,
  ],
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
