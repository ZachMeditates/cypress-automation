// cypress/e2e/basic-auth.spec.js

describe('Basic Authentication Tests', () => {
    // Base URL with credentials
    const authUrl = 'https://admin:admin@the-internet.herokuapp.com/basic_auth';
    
    it('should successfully authenticate with valid credentials', () => {
        cy.visit(authUrl);
        
        cy.get('p')
            .should('exist')
            .should('be.visible')
            .should('contain', 'Congratulations');
    });

    it('should handle failed authentication with invalid credentials', () => {
        const invalidUrl = 'https://invalid:wrong@the-internet.herokuapp.com/basic_auth';
        
        cy.on('fail', (error) => {
            expect(error.message).to.include('401');
            return false;
        });

        cy.visit(invalidUrl, { failOnStatusCode: false });
    });

    it('should verify page content after successful authentication', () => {
        cy.visit(authUrl);
        
        cy.get('.example')
            .should('exist')
            .within(() => {
                cy.get('h3').should('contain', 'Basic Auth');
                cy.get('p').should('not.be.empty');
            });
    });

    it('should maintain authentication across multiple pages', () => {
        // Initial visit with auth
        cy.visit(authUrl);
        
        // Verify initial auth
        cy.get('p')
            .should('contain', 'Congratulations');
        
        // Navigate away
        cy.visit('https://admin:admin@the-internet.herokuapp.com');
        
        // Navigate back with auth
        cy.visit(authUrl);
        
        // Verify still authenticated
        cy.get('p')
            .should('contain', 'Congratulations');
    });
});