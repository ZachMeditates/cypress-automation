// cypress/pages/BasicAuthPage.js

class BasicAuthPage {
    selectors = {
        successMessage: 'p',
        pageContent: '.example',
        header: 'h3'
    };

    /**
     * Visit the basic auth page with credentials
     * @param {string} username - The username for basic auth
     * @param {string} password - The password for basic auth
     */
    visitWithAuth(username = 'admin', password = 'admin') {
        // Configure basic auth headers before visit
        cy.session([username, password], () => {
            cy.visit('/basic_auth', {
                auth: {
                    username: username,
                    password: password
                },
                failOnStatusCode: false
            });
        });
        
        // Visit the page using the established session
        cy.visit('/basic_auth', {
            failOnStatusCode: false
        });
        
        return this;
    }

    /**
     * Get the success message element
     * @returns {Cypress.Chainable}
     */
    getSuccessMessage() {
        return cy.get(this.selectors.successMessage);
    }

    /**
     * Get the page content
     * @returns {Cypress.Chainable}
     */
    getPageContent() {
        return cy.get(this.selectors.pageContent);
    }

    /**
     * Check if authentication was successful
     * @returns {BasicAuthPage}
     */
    verifySuccessfulAuth() {
        this.getSuccessMessage()
            .should('exist')
            .should('be.visible')
            .and('contain', 'Congratulations');
        return this;
    }
}

export default new BasicAuthPage();