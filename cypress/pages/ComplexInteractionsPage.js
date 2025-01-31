// cypress/pages/ComplexInteractionsPage.js

class ComplexInteractionsPage {
    selectors = {
        // Drag and Drop elements
        columnA: '#column-a',
        columnB: '#column-b',
        
        // iFrame elements
        textEditor: '#mce_0_ifr',
        editorBody: '#tinymce',
        boldButton: 'button[title="Bold"]',
        italicButton: 'button[title="Italic"]',
        
        // Nested frames
        topFrame: '[name="frame-top"]',
        leftFrame: '[name="frame-left"]',
        middleFrame: '[name="frame-middle"]',
        rightFrame: '[name="frame-right"]',
        bottomFrame: '[name="frame-bottom"]',
        
        // Menu elements
        menuItems: '.menu > li',
        subMenuItems: '.dropdown-menu > li'
    };

    /**
     * Visit the drag and drop page
     */
    visitDragAndDrop() {
        cy.visit('/drag_and_drop');
        return this;
    }

    /**
     * Visit the iframe page
     */
    visitIframePage() {
        cy.visit('/iframe');
        return this;
    }

    /**
     * Visit the nested frames page
     */
    visitNestedFrames() {
        cy.visit('/nested_frames');
        return this;
    }

    /**
     * Perform drag and drop operation
     * @param {string} source - source element
     * @param {string} target - target element
     */
    dragAndDrop(source, target) {
        const dataTransfer = new DataTransfer();

        cy.get(source)
            .trigger('dragstart', { dataTransfer });
        
        cy.get(target)
            .trigger('drop', { dataTransfer });
        
        cy.get(source)
            .trigger('dragend');

        return this;
    }

    /**
     * Switch to iframe and perform action
     * @param {string} action - text to type in iframe
     */
    typeInIframe(text) {
        cy.get(this.selectors.textEditor)
            .its('0.contentDocument.body')
            .should('be.visible')
            .then(cy.wrap)
            .clear()
            .type(text);
        
        return this;
    }

    /**
     * Format text in iframe
     * @param {string} format - 'bold' or 'italic'
     */
    formatText(format) {
        const button = format === 'bold' ? 
            this.selectors.boldButton : 
            this.selectors.italicButton;
        
        cy.get(button).click();
        return this;
    }

    /**
     * Get text from a specific frame
     * @param {string} frameSelector - selector for the frame
     */
    getFrameText(frameSelector) {
        return cy.get(frameSelector)
            .its('0.contentDocument.body')
            .should('be.visible')
            .then(cy.wrap);
    }

    /**
     * Verify column contents after drag and drop
     * @param {string} columnSelector - selector for the column
     * @param {string} expectedText - expected text in the column
     */
    verifyColumnContent(columnSelector, expectedText) {
        cy.get(columnSelector)
            .should('have.text', expectedText);
        return this;
    }
}

export default new ComplexInteractionsPage();