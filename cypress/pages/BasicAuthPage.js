// cypress/pages/BasicAuthPage.js

class BasicAuthPage {
    selectors = {
        successMessage: 'p',
        pageContent: '.example'
    };

    /**
     * Visit the basic auth page with credentials in the URL
     * @param {string} username - The username for basic auth
     * @param {string} password - The password for basic auth
     */
    visitWithAuth(username = 'admin', password = 'admin') {
        cy.visit(`/basic_auth`, {
            auth: {
                username,
                password
            }
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
     * @returns {Cypress.Chainable}
     */
    verifySuccessfulAuth() {
        this.getSuccessMessage()
            .should('contain', 'Congratulations')
            .and('contain', 'successfully logged into a secure area');
        return this;
    }
}

export default new BasicAuthPage();