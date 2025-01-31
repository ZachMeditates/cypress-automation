// cypress/pages/HomePage.js

class HomePage {
    // Selectors stored as properties
    selectors = {
        header: 'h1',
        exampleLinks: 'ul > li > a'
    };

    /**
     * Navigates to the home page
     * @returns {HomePage} returns the page object for chaining
     */
    visit() {
        cy.visit('/');
        return this;
    }

    /**
     * Gets the main header element
     * @returns {Cypress.Chainable} the header element
     */
    getHeader() {
        return cy.get(this.selectors.header);
    }

    /**
     * Gets all example links on the page
     * @returns {Cypress.Chainable} collection of link elements
     */
    getExampleLinks() {
        return cy.get(this.selectors.exampleLinks);
    }

    /**
     * Clicks a specific example link by its text
     * @param {string} linkText - The text of the link to click
     * @returns {HomePage} returns the page object for chaining
     */
    clickExampleLink(linkText) {
        this.getExampleLinks().contains(linkText).click();
        return this;
    }
}

export default new HomePage();