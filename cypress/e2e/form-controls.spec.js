// cypress/e2e/form-controls.spec.js

import FormControlsPage from '../pages/FormControlsPage';

describe('Form Controls Tests', () => {
    describe('Dropdown Tests', () => {
        beforeEach(() => {
            FormControlsPage.visitDropdownPage();
        });

        it('should select different dropdown options', () => {
            // Select and verify each option
            FormControlsPage
                .selectDropdownOption('1')
                .selectDropdownOption('2');
            
            // Verify current selection
            cy.get('#dropdown').should('have.value', '2');
        });
    });

    describe('Checkbox Tests', () => {
        beforeEach(() => {
            FormControlsPage.visitCheckboxesPage();
        });

        it('should toggle checkboxes correctly', () => {
            // Toggle first checkbox on and off
            FormControlsPage
                .toggleCheckbox(1, true)
                .toggleCheckbox(1, false);

            // Toggle second checkbox off and on
            FormControlsPage
                .toggleCheckbox(2, false)
                .toggleCheckbox(2, true);

            // Verify final states
            cy.get('#checkboxes input:first-child').should('not.be.checked');
            cy.get('#checkboxes input:last-child').should('be.checked');
        });
    });

    describe('Dynamic Controls Tests', () => {
        beforeEach(() => {
            FormControlsPage.visitDynamicControlsPage();
        });

        it('should enable input and type text', () => {
            const testText = 'Testing dynamic input';

            FormControlsPage
                .toggleInput()  // Enable the input
                .typeIntoInput(testText);

            // Verify text was entered
            cy.get('#input-example input')
                .should('have.value', testText)
                .and('be.enabled');

            FormControlsPage
                .toggleInput();  // Disable the input

            // Verify input is disabled
            cy.get('#input-example input')
                .should('be.disabled');
        });
    });

    describe('Upload Tests', () => {
        beforeEach(() => {
            cy.visit('/upload');
        });

        it('should upload a file successfully', () => {
            // Create a test file using cy.writeFile
            cy.writeFile('cypress/fixtures/test-file.txt', 'Hello, World!');

            FormControlsPage
                .uploadFile('cypress/fixtures/test-file.txt');

            // Verify upload success
            cy.get('#uploaded-files')
                .should('contain', 'test-file.txt');
        });
    });

    describe('Complex Interaction Tests', () => {
        it('should handle a sequence of different interactions', () => {
            // Start with dropdown
            FormControlsPage
                .visitDropdownPage()
                .selectDropdownOption('1');

            // Move to checkboxes
            FormControlsPage
                .visitCheckboxesPage()
                .toggleCheckbox(1, true)
                .toggleCheckbox(2, true);

            // End with dynamic controls
            FormControlsPage
                .visitDynamicControlsPage()
                .toggleInput()
                .typeIntoInput('Complex interaction complete!');

            // Final verification
            FormControlsPage
                .getMessage()
                .should('be.visible');
        });
    });
});