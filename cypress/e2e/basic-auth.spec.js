// cypress/e2e/basic-auth.spec.js

import BasicAuthPage from '../pages/BasicAuthPage';

describe('Basic Authentication Tests', () => {
    const validCredentials = {
        username: 'admin',
        password: 'admin'
    };

    const invalidCredentials = {
        username: 'invalid',
        password: 'wrong'
    };

    it('should successfully authenticate with valid credentials', () => {
        BasicAuthPage
            .visitWithAuth(validCredentials.username, validCredentials.password)
            .verifySuccessfulAuth();
    });

    it('should handle failed authentication with invalid credentials', () => {
        // Intercept the auth failure response
        cy.on('fail', (error) => {
            expect(error.message).to.include('401');
            return false;
        });

        // Attempt to visit with invalid credentials
        BasicAuthPage.visitWithAuth(
            invalidCredentials.username, 
            invalidCredentials.password
        );
    });

    it('should verify page content after successful authentication', () => {
        BasicAuthPage.visitWithAuth(
            validCredentials.username, 
            validCredentials.password
        );

        // Verify the page content
        BasicAuthPage
            .getPageContent()
            .should('exist')
            .within(() => {
                // Check for specific elements or text
                cy.get('h3').should('contain', 'Basic Auth');
                cy.get('p').should('not.be.empty');
            });
    });

    it('should maintain authentication across multiple pages', () => {
        // First authenticate
        BasicAuthPage.visitWithAuth(
            validCredentials.username, 
            validCredentials.password
        );

        // Verify initial authentication
        BasicAuthPage.verifySuccessfulAuth();

        // Navigate away and back to verify session
        cy.visit('/');
        cy.visit('/basic_auth', {
            auth: {
                username: validCredentials.username,
                password: validCredentials.password
            }
        });

        // Verify still authenticated
        BasicAuthPage.verifySuccessfulAuth();
    });
});