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
        cy.visit(`https://${username}:${password}@the-internet.herokuapp.com/basic_auth`, {
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
        cy.get(this.selectors.successMessage)
            .should('exist')
            .should('be.visible')
            .should('contain', 'Congratulations')
            .should('contain', 'successfully logged into a secure area');
        return this;
    }
}

export default new BasicAuthPage();