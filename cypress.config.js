const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for your application under test
    baseUrl: 'https://the-internet.herokuapp.com',

    // Configure how tests are run and retried
    retries: {
      runMode: 2,      // Retry failed tests twice in CI/headless mode
      openMode: 0      // Don't retry in interactive mode (cypress open)
    },

    // Browser viewport dimensions - important for responsive testing
    viewportWidth: 1280,
    viewportHeight: 720,

    // Maximum time to wait for commands/assertions (in milliseconds)
    defaultCommandTimeout: 5000,

    // Test recording settings
    video: true,                    // Save video recordings of test runs
    screenshotOnRunFailure: true,   // Capture screenshots on test failures

    // Test file location pattern
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',

    // Location for downloaded files during tests
    downloadsFolder: 'cypress/downloads',

    // Enable experimental memory management to reduce memory usage
    experimentalMemoryManagement: true,

    // Disable same-origin policy - useful for testing cross-origin iframes
    chromeWebSecurity: false,

    // Environment-specific settings
    env: {
      failOnSnapshotDiff: true,    // Fail tests if visual snapshots don't match
      updateSnapshots: false        // Don't automatically update snapshots
    },

    // Node event listeners for plugins
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      // Common uses: custom commands, preprocessors, or reporters
    }
  },
});