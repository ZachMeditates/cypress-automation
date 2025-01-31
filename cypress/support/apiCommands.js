// cypress/support/apiCommands.js

// Custom command for API requests
Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
    return cy.request({
        method: method,
        url: endpoint,
        body: body,
        failOnStatusCode: false, // Don't fail on non-2xx response
        headers: {
            'Content-Type': 'application/json',
            // Add any other required headers
        }
    });
});

// Custom command to verify API and UI consistency
Cypress.Commands.add('verifyApiAndUi', (endpoint, uiSelector, propertyToCheck) => {
    // Make API request
    cy.apiRequest('GET', endpoint).then(apiResponse => {
        // Visit the page
        cy.visit(endpoint);
        
        // Get UI element
        cy.get(uiSelector).then($element => {
            const uiContent = $element.text().trim();
            cy.log('UI Content:', uiContent);
            cy.log('API Content:', apiResponse.body[propertyToCheck]);
        });
    });
});