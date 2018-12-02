const fs = require('fs');
const { SpecReporter } = require('jasmine-spec-reporter');

const env = JSON.parse(fs.readFileSync('config/environment.json'));

const chromeCapability = {
  browserName: 'chrome',
  loggingPrefs: {
    browser: 'ALL',
  },
  chromeOptions: {
    // Get rid of --ignore-certificate yellow warning
    args: ['--no-sandbox', '--test-type=browser'],
    // Set download path and avoid prompting for download. Even though
    // this is already the default on Chrome but for completeness
    prefs: {
      download: {
        prompt_for_download: false,
        directory_upgrade: true,
        default_directory: '/tmp/telepathy-e2e/downloads/',
        default_content_settings: {
          popups: 0,
        },
      },
      profile: {
        content_settings: {
          exceptions: {
            automatic_downloads: {
              '*': {
                setting: 1
              },
            },
          },
        },
      },
    },
  },
};

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  seleniumAddress: `http://${env.seleniumHost}:${env.seleniumPort}/wd/hub`,
  directConnect: false,
  baseUrl: `http://localhost:${env.frontendPort}`,
  multiCapabilities: [
    chromeCapability,
  ],
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  beforeLaunch: function() {
    console.log('Serving to: ', env.frontendPort, env.frontendListen)
    require('connect')().use(require('serve-static')('/output/www')).listen(
      env.frontendPort,
      env.frontendListen,
    );
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
