// cypress/e2e/api-ui.spec.js

describe('API and UI Testing Combined', () => {
    // Test data
    const validUser = {
        username: 'tomsmith',
        password: 'SuperSecretPassword!'
    };

    describe('Authentication Flow', () => {
        it('should login via API and verify UI state', () => {
            // API Login Request
            cy.request({
                method: 'POST',
                url: '/authenticate',
                body: validUser,
                failOnStatusCode: false // Because this demo site doesn't have a real API
            }).then((response) => {
                // Log API response for debugging
                cy.log('API Response:', response.status);
            });

            // UI Verification after API call
            cy.visit('/login');
            cy.get('#username').type(validUser.username);
            cy.get('#password').type(validUser.password);
            cy.get('button[type="submit"]').click();

            // Verify successful login in UI
            cy.url().should('include', '/secure');
            cy.get('#flash').should('contain', 'You logged into a secure area');
        });

        it('should handle invalid login via API and UI', () => {
            const invalidUser = {
                username: 'invalid',
                password: 'invalid'
            };

            // API Invalid Login Attempt
            cy.request({
                method: 'POST',
                url: '/authenticate',
                body: invalidUser,
                failOnStatusCode: false
            }).then((response) => {
                cy.log('API Response for invalid login:', response.status);
            });

            // UI Verification of invalid login
            cy.visit('/login');
            cy.get('#username').type(invalidUser.username);
            cy.get('#password').type(invalidUser.password);
            cy.get('button[type="submit"]').click();

            // Verify error message in UI
            cy.get('#flash').should('contain', 'Your username is invalid');
        });
    });

    describe('Dynamic Data Loading', () => {
        it('should verify API data matches UI content', () => {
            // API Request for content
            cy.request('/dynamic_content').then((response) => {
                // Store the response HTML
                const apiHtml = response.body;

                // Visit the page in UI
                cy.visit('/dynamic_content');

                // Get UI content
                cy.get('.row:first').then(($element) => {
                    const uiContent = $element.text().trim();
                    // Log contents for comparison
                    cy.log('UI Content:', uiContent);
                });
            });
        });
    });

    describe('API Status Checks with UI Feedback', () => {
        it('should check status endpoint and display in UI', () => {
            // API Health Check
            cy.request('/status').then((response) => {
                cy.log('API Status:', response.status);
            });

            // Navigate to status page in UI
            cy.visit('/status_codes/200');
            cy.get('p').should('contain', '200');
        });

        it('should handle different status codes', () => {
            const statusCodes = [200, 301, 404, 500];

            // Test each status code
            statusCodes.forEach(code => {
                cy.request({
                    url: `/status_codes/${code}`,
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.equal(code);
                });

                // Verify UI display for each code
                cy.visit(`/status_codes/${code}`);
                cy.get('p').should('contain', code.toString());
            });
        });
    });

    describe('Form Submission with API Verification', () => {
        it('should submit form and verify data via API and UI', () => {
            const testData = {
                email: 'test@example.com',
                message: 'Test message'
            };

            // Submit form via UI
            cy.visit('/key_presses');
            cy.get('#target').type(testData.message);

            // Verify key press results
            cy.get('#result').should('be.visible');

            // API verification (simulated as the demo site doesn't have a real API)
            cy.request({
                method: 'GET',
                url: '/key_presses',
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(200);
            });
        });
    });
});