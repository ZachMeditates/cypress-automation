// cypress/pages/SecurePage.js

class SecurePage {
    selectors = {
        header: 'h2',
        flashMessage: '#flash',
        logoutButton: '.button.secondary',
        secureAreaText: '.subheader'
    };

    /**
     * Verifies we are on the secure page
     * @returns {SecurePage} returns the page object for chaining
     */
    validateSecurePage() {
        cy.url().should('include', '/secure');
        this.getHeader().should('contain.text', 'Secure Area');
        return this;
    }

    /**
     * Gets the header element
     * @returns {Cypress.Chainable} the header element
     */
    getHeader() {
        return cy.get(this.selectors.header);
    }

    /**
     * Gets the flash message element
     * @returns {Cypress.Chainable} the flash message element
     */
    getFlashMessage() {
        return cy.get(this.selectors.flashMessage);
    }

    /**
     * Gets the secure area text content
     * @returns {Cypress.Chainable} the secure area text element
     */
    getSecureAreaText() {
        return cy.get(this.selectors.secureAreaText);
    }

    /**
     * Clicks the logout button
     * @returns {SecurePage} returns the page object for chaining
     */
    logout() {
        cy.get(this.selectors.logoutButton)
            .should('be.visible')
            .click();
        return this;
    }
}

export default new SecurePage();