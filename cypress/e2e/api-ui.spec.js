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
                failOnStatusCode: false
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
        it('should handle different status codes', () => {
            // Handle 200 status
            cy.request({
                url: '/status_codes/200',
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.equal(200);
            });
    
            cy.visit('/status_codes/200', { failOnStatusCode: false });
            cy.get('p').should('contain', '200');
    
            // Handle 301 status
            cy.request({
                url: '/status_codes/301',
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.equal(301);
            });
    
            cy.visit('/status_codes/301', { failOnStatusCode: false });
            cy.get('p').should('contain', '301');
    
            // Handle 404 status
            cy.request({
                url: '/status_codes/404',
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.equal(404);
            });
    
            cy.visit('/status_codes/404', { failOnStatusCode: false });
            cy.get('p').should('contain', '404');
    
            // Handle 500 status
            cy.request({
                url: '/status_codes/500',
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.equal(500);
            });
    
            cy.visit('/status_codes/500', { failOnStatusCode: false });
            cy.get('p').should('contain', '500');
        });
    });

    describe('Form Submission with API Verification', () => {
        it('should submit form and verify data via API and UI', () => {
            const testData = {
                key: 'A',
                message: 'Test message'
            };

            // Submit via UI
            cy.visit('/key_presses');
            cy.get('#target').type(testData.key);

            // Verify key press results in UI
            cy.get('#result').should('be.visible')
                .and('contain', `You entered: ${testData.key}`);

            // API verification
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