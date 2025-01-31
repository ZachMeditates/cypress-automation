// cypress/pages/FormControlsPage.js

class FormControlsPage {
    selectors = {
        // Dropdown elements
        dropdown: '#dropdown',
        
        // Checkboxes
        checkbox1: '#checkboxes input:first-child',
        checkbox2: '#checkboxes input:last-child',
        
        // Dynamic controls
        enableButton: '#input-example button',
        textInput: '#input-example input',
        
        // File upload
        fileUpload: '#file-upload',
        uploadButton: '#file-submit',
        uploadedFiles: '#uploaded-files',

        // Hovers
        figureBoxes: '.figure',
        figureCaption: '.figcaption',

        // Status messages
        message: '#message'
    };

    /**
     * Visit the dropdown page
     */
    visitDropdownPage() {
        cy.visit('/dropdown');
        return this;
    }

    /**
     * Visit the checkboxes page
     */
    visitCheckboxesPage() {
        cy.visit('/checkboxes');
        return this;
    }

    /**
     * Visit the dynamic controls page
     */
    visitDynamicControlsPage() {
        cy.visit('/dynamic_controls');
        return this;
    }

    /**
     * Select dropdown option by value
     * @param {string} value - The value to select
     */
    selectDropdownOption(value) {
        cy.get(this.selectors.dropdown)
            .select(value)
            .should('have.value', value);
        return this;
    }

    /**
     * Toggle checkbox by index (1 or 2)
     * @param {number} index - The checkbox index (1 or 2)
     * @param {boolean} checked - Whether to check or uncheck
     */
    toggleCheckbox(index, checked = true) {
        const selector = index === 1 ? this.selectors.checkbox1 : this.selectors.checkbox2;
        cy.get(selector).invoke('prop', 'checked').then((isChecked) => {
            if (isChecked !== checked) {
                cy.get(selector).click();
            }
        });
        return this;
    }

    /**
     * Enable/disable input through dynamic controls
     */
    toggleInput() {
        cy.get(this.selectors.enableButton).click();
        // Wait for the loading animation to complete
        cy.get('#loading').should('not.exist');
        return this;
    }

    /**
     * Type into the dynamic input when enabled
     * @param {string} text - Text to type
     */
    typeIntoInput(text) {
        cy.get(this.selectors.textInput)
            .should('be.enabled')
            .clear()
            .type(text);
        return this;
    }

    /**
     * Upload a file
     * @param {string} fileName - Name of file to upload
     */
    uploadFile(fileName) {
        cy.get(this.selectors.fileUpload).selectFile(fileName);
        cy.get(this.selectors.uploadButton).click();
        return this;
    }

    /**
     * Hover over figure by index
     * @param {number} index - The figure index (0-based)
     */
    hoverOverFigure(index) {
        cy.get(this.selectors.figureBoxes)
            .eq(index)
            .trigger('mouseover');
        return this;
    }

    /**
     * Get message element
     */
    getMessage() {
        return cy.get(this.selectors.message);
    }
}

export default new FormControlsPage();