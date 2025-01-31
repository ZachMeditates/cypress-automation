// cypress/support/e2e.js
// Import commands.js using ES2015 syntax:
import './visualCommands';
import './commands';
import './apiCommands';

// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});