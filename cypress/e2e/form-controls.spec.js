// cypress/e2e/form-controls.spec.js

describe('Form Controls Tests', () => {
    describe('Dynamic Controls Tests', () => {
        beforeEach(() => {
            cy.visit('/dynamic_controls');
        });

        it('should enable input and type text', () => {
            const testText = 'Testing dynamic input';
            
            // Get the input-example section for better scoping
            cy.get('#input-example').within(() => {
                // Initial state - input should be disabled
                cy.get('input').should('be.disabled');
                
                // Click the button and wait for state changes
                cy.get('button').click();
                
                // Wait for the button state to change (this indicates loading completed)
                cy.get('button').should('contain', 'Disable');
                
                // Now input should be enabled and we can type
                cy.get('input')
                    .should('be.enabled')
                    .type(testText);
            });
        });
    });

    describe('Complex Interaction Tests', () => {
        it('should handle a sequence of different interactions', () => {
            // 1. Dropdown interaction
            cy.visit('/dropdown');
            cy.get('#dropdown').select('1');
            
            // 2. Checkbox interaction
            cy.visit('/checkboxes');
            cy.get('input[type="checkbox"]').first().check();
            cy.get('input[type="checkbox"]').last().check();
            
            // 3. Dynamic Controls interaction
            cy.visit('/dynamic_controls');
            
            // Handle the input section
            cy.get('#input-example').within(() => {
                // Initial state check
                cy.get('input').should('be.disabled');
                
                // Click enable and wait for button text to change
                cy.get('button').click();
                cy.get('button').should('contain', 'Disable');
                
                // Type the final text
                cy.get('input')
                    .should('be.enabled')
                    .type('Complex interaction complete!');
            });
        });
    });
});