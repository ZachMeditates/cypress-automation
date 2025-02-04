const { defineConfig } = require('cypress');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    // Base URL for your application under test
    baseUrl: 'https://the-internet.herokuapp.com',

    // Configure how tests are run and retried
    retries: {
      runMode: 2,      // Retry failed tests twice in CI/headless mode
      openMode: 0      // Don't retry in interactive mode (cypress open)
    },

    // Browser viewport dimensions
    viewportWidth: 1280,
    viewportHeight: 720,

    // Command timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,

    // Test recording settings
    video: true,
    screenshotOnRunFailure: true,

    // Test file location pattern
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',

    // File handling settings
    downloadsFolder: 'cypress/downloads',
    fileServerFolder: 'cypress/fixtures',
    watchForFileChanges: false,

    // Security and experimental features
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
    experimentalSessionAndOrigin: true,

    // Environment settings
    env: {
      failOnSnapshotDiff: true,
      updateSnapshots: false
    },

    setupNodeEvents(on, config) {
      // File download checking task
      on('task', {
        checkDownloadExists() {
          return new Promise((resolve) => {
            const downloadFolder = config.downloadsFolder;
            fs.readdir(downloadFolder, (err, files) => {
              if (err) resolve(false);
              resolve(files && files.length > 0);
            });
          });
        },

        // Clean downloads folder
        deleteDownloads() {
          return new Promise((resolve) => {
            const downloadFolder = config.downloadsFolder;
            fs.readdir(downloadFolder, (err, files) => {
              if (err) resolve(false);
              
              for (const file of files) {
                fs.unlinkSync(`${downloadFolder}/${file}`);
              }
              resolve(true);
            });
          });
        },

        // Get downloaded file names
        getDownloadedFiles() {
          return new Promise((resolve) => {
            const downloadFolder = config.downloadsFolder;
            fs.readdir(downloadFolder, (err, files) => {
              if (err) resolve([]);
              resolve(files || []);
            });
          });
        }
      });

      // Browser launch configuration for downloads
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.preferences.default['download'] = {
            default_directory: config.downloadsFolder,
            prompt_for_download: false,
            directory_upgrade: true
          };
        }

        if (browser.family === 'firefox') {
          launchOptions.preferences['browser.download.dir'] = config.downloadsFolder;
          launchOptions.preferences['browser.download.folderList'] = 2;
          launchOptions.preferences['browser.download.manager.showWhenStarting'] = false;
          launchOptions.preferences['browser.helperApps.neverAsk.saveToDisk'] = 'application/octet-stream';
        }

        return launchOptions;
      });

      // Handle failed tests using valid event name
      on('after:run', () => {
        // Clean up after all tests complete
        console.log('Tests completed, performing cleanup...');
      });

      return config;
    }
  },
});