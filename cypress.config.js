const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'DemoQA E2E Results',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  video: false,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  blockHosts: [
    '*.doubleclick.net',
    '*.googlesyndication.com',
    '*.googleadservices.com',
    '*.googletagservices.com',
    '*.googletagmanager.com',
    '*.google-analytics.com',
    '*.adsafeprotected.com',
    '*.amazon-adsystem.com',
    '*.criteo.com',
    '*.pubmatic.com',
    '*.rubiconproject.com',
    '*.openx.net',
    '*.casalemedia.com',
    '*.adnxs.com',
  ],
  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
        table(rows) {
          console.table(rows);
          return null;
        },
      });
      return config;
    },
  },
});
