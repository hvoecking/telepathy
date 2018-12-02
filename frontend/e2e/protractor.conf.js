const fs = require('fs');
const { SpecReporter } = require('jasmine-spec-reporter');

const env = JSON.parse(fs.readFileSync(process.env.ENV_DIR + '/environment.json'));
const androidPixel2XLCapability = {
  'app-activity': 'MainActivity',
  'app-package': 'io.ionic.starter',
  //app: '/home/app/telepathy/platforms/android/app/build/outputs/apk/debug/app-debug.apk',
  app: '/tmp/app-debug.apk',
  autoAcceptAlerts: 'true',
  autoGrantPermissions: 'true',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  browserName: '',
  deviceName: 'unused',
  newCommandTimeout: 300000,
  platformName: 'Android',
};

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
  baseUrl: 'http://localhost:8100',
  multiCapabilities: [
    androidPixel2XLCapability,
    chromeCapability,
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
