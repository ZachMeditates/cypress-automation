// cypress/e2e/home.spec.js

import HomePage from '../pages/HomePage';

describe('The Internet Homepage', () => {
    beforeEach(() => {
        HomePage.visit();
    });

    it('should display the correct header text', () => {
        HomePage
            .getHeader()
            .should('be.visible')
            .and('have.text', 'Welcome to the-internet');
    });

    it('should contain multiple example links', () => {
        HomePage
            .getExampleLinks()
            .should('have.length.gt', 0)
            .and('be.visible');
    });

    it('should navigate to a specific example', () => {
        const examplePage = 'Form Authentication';
        
        HomePage
            .clickExampleLink(examplePage);
        
        // Verify URL changed
        cy.url().should('include', '/login');
    });
});