// cypress/e2e/login.spec.js

import LoginPage from '../pages/LoginPage';
import SecurePage from '../pages/SecurePage';

describe('Login Functionality', () => {
    beforeEach(() => {
        LoginPage.visit();
    });

    it('should login successfully with valid credentials', () => {
        LoginPage
            .login('tomsmith', 'SuperSecretPassword!');

        // Verify successful login
        SecurePage
            .validateSecurePage()
            .getFlashMessage()
            .should('contain.text', 'You logged into a secure area!');
    });

    it('should show error with invalid credentials', () => {
        LoginPage
            .login('invalid', 'invalid123');

        // Verify error message
        LoginPage
            .getFlashMessage()
            .should('contain.text', 'Your username is invalid!');
    });

    it('should logout successfully', () => {
        // Login first
        LoginPage
            .login('tomsmith', 'SuperSecretPassword!');

        // Verify successful login
        SecurePage.validateSecurePage();

        // Logout
        SecurePage.logout();

        // Verify logout
        LoginPage
            .getFlashMessage()
            .should('contain.text', 'You logged out of the secure area!');
    });
});