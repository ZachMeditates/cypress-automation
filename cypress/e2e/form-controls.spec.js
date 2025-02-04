// cypress/e2e/form-controls.spec.js

describe('Form Controls Tests', () => {
    describe('Dropdown Tests', () => {
        beforeEach(() => {
            cy.visit('/dropdown');
        });

        it('should select different dropdown options', () => {
            // Select and verify each option
            cy.get('#dropdown')
                .select('1')
                .should('have.value', '1');
            
            cy.get('#dropdown')
                .select('2')
                .should('have.value', '2');
        });
    });

    describe('Checkbox Tests', () => {
        beforeEach(() => {
            cy.visit('/checkboxes');
        });

        it('should toggle checkboxes correctly', () => {
            // First checkbox starts unchecked
            cy.get('input[type="checkbox"]').first()
                .check()
                .should('be.checked')
                .uncheck()
                .should('not.be.checked');

            // Second checkbox usually starts checked
            cy.get('input[type="checkbox"]').last()
                .uncheck()
                .should('not.be.checked')
                .check()
                .should('be.checked');
        });
    });

    describe('Dynamic Controls Tests', () => {
        beforeEach(() => {
            cy.visit('/dynamic_controls');
        });

        it('should enable input and type text', () => {
            const testText = 'Testing dynamic input';
            
            // Get the input section
            cy.get('#input-example')
                .find('input[type="text"]')
                .should('be.disabled');
            
            // Click enable button and wait for the loading to complete
            cy.get('#input-example')
                .find('button')
                .click();
            
            cy.get('#input-example')
                .find('#loading')
                .should('exist');
            
            cy.get('#input-example')
                .find('#loading')
                .should('not.exist');
            
            // Type text and verify
            cy.get('#input-example')
                .find('input[type="text"]')
                .should('be.enabled')
                .type(testText)
                .should('have.value', testText);

            // Click disable button and verify
            cy.get('#input-example')
                .find('button')
                .click();
            
            cy.get('#input-example')
                .find('#loading')
                .should('exist');
            
            cy.get('#input-example')
                .find('#loading')
                .should('not.exist');
            
            cy.get('#input-example')
                .find('input[type="text"]')
                .should('be.disabled');
        });
    });

    describe('Upload Tests', () => {
        beforeEach(() => {
            cy.visit('/upload');
        });

        it('should upload a file successfully', () => {
            // Create a sample text file to upload
            cy.fixture('example.json').then(fileContent => {
                cy.get('#file-upload')
                    .selectFile({
                        contents: Cypress.Buffer.from(JSON.stringify(fileContent)),
                        fileName: 'test-file.txt',
                        mimeType: 'text/plain'
                    });
                
                cy.get('#file-submit').click();
                
                cy.get('#uploaded-files')
                    .should('be.visible')
                    .and('contain', 'test-file.txt');
            });
        });
    });

    describe('Complex Interaction Tests', () => {
        it('should handle a sequence of different interactions', () => {
            // Start with dropdown
            cy.visit('/dropdown');
            cy.get('#dropdown')
                .select('1')
                .should('have.value', '1');
            
            // Move to checkboxes
            cy.visit('/checkboxes');
            cy.get('input[type="checkbox"]').first()
                .check()
                .should('be.checked');
            cy.get('input[type="checkbox"]').last()
                .check()
                .should('be.checked');
            
            // End with dynamic controls
            cy.visit('/dynamic_controls');
            
            // Enable input
            cy.get('#input-example')
                .find('button')
                .click();
            
            cy.get('#input-example')
                .find('#loading')
                .should('exist');
            
            cy.get('#input-example')
                .find('#loading')
                .should('not.exist');
            
            // Type text and verify
            const finalText = 'Complex interaction complete!';
            cy.get('#input-example')
                .find('input[type="text"]')
                .should('be.enabled')
                .type(finalText)
                .should('have.value', finalText);

            // Verify final state
            cy.get('#message')
                .should('be.visible')
                .and('contain', 'enabled');
        });
    });
});