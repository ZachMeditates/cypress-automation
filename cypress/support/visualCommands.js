// cypress/support/visualCommands.js

// Import Percy
import '@percy/cypress';

// Custom command to handle shadow DOM elements
Cypress.Commands.add('getShadow', { prevSubject: 'element' }, (el) => {
  return cy.wrap(el).shadow();
});

// Custom command to take visual snapshot with Percy
Cypress.Commands.add('takeVisualSnapshot', (name) => {
  cy.percySnapshot(name);
});

// Custom command for visual comparison of specific element
Cypress.Commands.add('compareElement', { prevSubject: 'element' }, (subject, name) => {
  cy.wrap(subject).within(() => {
    cy.percySnapshot(name);
  });
});