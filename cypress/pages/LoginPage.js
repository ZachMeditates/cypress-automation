// cypress/pages/LoginPage.js

class LoginPage {
    // Selectors stored as properties
    selectors = {
        usernameInput: '#username',
        passwordInput: '#password',
        loginButton: 'button[type="submit"]',
        flashMessage: '#flash',
        logoutButton: '.button.secondary'
    };

    /**
     * Navigates directly to the login page
     * @returns {LoginPage} returns the page object for chaining
     */
    visit() {
        cy.visit('/login');
        return this;
    }

    /**
     * Types into the username field
     * @param {string} username - The username to type
     * @returns {LoginPage} returns the page object for chaining
     */
    typeUsername(username) {
        cy.get(this.selectors.usernameInput)
            .should('be.visible')
            .clear()
            .type(username);
        return this;
    }

    /**
     * Types into the password field
     * @param {string} password - The password to type
     * @returns {LoginPage} returns the page object for chaining
     */
    typePassword(password) {
        cy.get(this.selectors.passwordInput)
            .should('be.visible')
            .clear()
            .type(password);
        return this;
    }

    /**
     * Clicks the login button
     * @returns {LoginPage} returns the page object for chaining
     */
    clickLogin() {
        cy.get(this.selectors.loginButton)
            .should('be.visible')
            .click();
        return this;
    }

    /**
     * Gets the flash message element
     * @returns {Cypress.Chainable} the flash message element
     */
    getFlashMessage() {
        return cy.get(this.selectors.flashMessage);
    }

    /**
     * Complete login process with provided credentials
     * @param {string} username - The username to use
     * @param {string} password - The password to use
     * @returns {LoginPage} returns the page object for chaining
     */
    login(username, password) {
        this.typeUsername(username)
            .typePassword(password)
            .clickLogin();
        return this;
    }

    /**
     * Clicks the logout button if present
     * @returns {LoginPage} returns the page object for chaining
     */
    logout() {
        cy.get(this.selectors.logoutButton)
            .should('be.visible')
            .click();
        return this;
    }
}

export default new LoginPage();