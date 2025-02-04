// cypress/e2e/dynamic-loading.spec.js

describe('Dynamic Loading Tests', () => {
    describe('Example 1: Element Hidden', () => {
        beforeEach(() => {
            cy.visit('/dynamic_loading/1');
        });

        it('should load hidden element', () => {
            // Start the loading process
            cy.get('#start button').click();

            // Instead of checking for loading to be visible and then not exist,
            // we'll wait for the finish text to be visible
            cy.get('#finish', { timeout: 10000 })
                .should('be.visible')
                .find('h4')
                .should('have.text', 'Hello World!');
        });

        it('should handle multiple rapid clicks', () => {
            // Click rapidly
            cy.get('#start button').click();

            // Wait for final state
            cy.get('#finish', { timeout: 10000 })
                .should('be.visible')
                .find('h4')
                .should('have.text', 'Hello World!');
        });
    });

    describe('Example 2: Element Rendered After Loading', () => {
        beforeEach(() => {
            cy.visit('/dynamic_loading/2');
        });

        it('should render new element', () => {
            // Start loading
            cy.get('#start button').click();

            // Wait for final state
            cy.get('#finish', { timeout: 10000 })
                .should('be.visible')
                .find('h4')
                .should('have.text', 'Hello World!');
        });
    });
});