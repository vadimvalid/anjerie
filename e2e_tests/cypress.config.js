const { defineConfig } = require('cypress');
const {
  addMatchImageSnapshotPlugin,
} = require('@simonsmith/cypress-image-snapshot/plugin');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost/',
    viewportWidth: 1920,
    viewportHeight: 1080,
    scrollBehavior: 'center',
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'tests-outputs/test-output-[hash].xml'
    },
    customDiffDir: 'cypress/snapshots_diff',
    chromeWebSecurity: false,
    specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    env: {
      FAIL_FAST_ENABLED: false
    },
    setupNodeEvents(on, config) {
      // Plugin for compare screenshots.
      addMatchImageSnapshotPlugin(on, config);
      // Plugin for fail fast in Cypress, skipping the rest of tests on first failure.
      require("cypress-fail-fast/plugin")(on, config);

      // Tasks for temporary store data between tests.
      let data;
      on('task', {
        saveData(value) {
          data = value;
          return null;
        },
        loadData() {
          return data || null;
        }
      });

      // Allow override config baseUrl using baseUrl from env file.
      const baseUrl = config.env.baseUrl || null;
      if (baseUrl) {
        config.baseUrl = baseUrl;
      }

      // Prepare list of sites where test must to be run and set it to env variable.
      const sitesFixturesFolder = config.env.sites_fixtures_folder;
      if (sitesFixturesFolder && fs.existsSync('cypress/fixtures/' + sitesFixturesFolder + '/sites.json')) {
        let rawData = fs.readFileSync('cypress/fixtures/' + sitesFixturesFolder + '/sites.json');
        const sites = JSON.parse(rawData);

        let sites_info = [];

        sites.forEach((site) => {
          let siteInfo = {};
          siteInfo.name = site.name;
          siteInfo.url = site.url;

          sites_info.push(siteInfo);
        });

        // Set sites inside the config object under the environment
        // which will make it available via Cypress.env("sites")
        // before the start of the tests
        config.env.sites = sites_info;
      }

      // Prepare resolution data array.
      if (sitesFixturesFolder && fs.existsSync('cypress/fixtures/' + sitesFixturesFolder + '/resolutions.json')) {
        let rawData = fs.readFileSync('cypress/fixtures/' + sitesFixturesFolder + '/resolutions.json');
        config.env.resolutions = JSON.parse(rawData);
      }
      else {
        config.env.resolutions = [
          {
            "name": "desktop",
            "viewportWidth": 1920,
            "viewportHeight": 1080
          }
        ];
      }

      return config;
    },
  }
})
