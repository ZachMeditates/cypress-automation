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
        topFrame: 'frame[name="frame-top"]',
        leftFrame: 'frame[name="frame-left"]',
        middleFrame: 'frame[name="frame-middle"]',
        rightFrame: 'frame[name="frame-right"]',
        bottomFrame: 'frame[name="frame-bottom"]'
    };

    visitDragAndDrop() {
        cy.visit('/drag_and_drop');
        cy.get(this.selectors.columnA).should('be.visible');
        cy.get(this.selectors.columnB).should('be.visible');
        return this;
    }

    visitIframePage() {
        cy.visit('/iframe');
        cy.get(this.selectors.textEditor).should('be.visible');
        return this;
    }

    visitNestedFrames() {
        cy.visit('/nested_frames');
        cy.get(this.selectors.topFrame).should('exist');
        return this;
    }

    performDragAndDrop() {
        const dataTransfer = new DataTransfer();

        cy.get(this.selectors.columnA)
            .should('be.visible')
            .trigger('dragstart', {
                dataTransfer
            })
            .trigger('drag');

        cy.get(this.selectors.columnB)
            .should('be.visible')
            .trigger('dragover', {
                dataTransfer
            })
            .trigger('drop', {
                dataTransfer
            });

        cy.get(this.selectors.columnA)
            .trigger('dragend');

        // Allow time for DOM updates
        cy.wait(500);
        
        return this;
    }

    typeInIframe(text) {
        cy.get(this.selectors.textEditor)
            .should('be.visible')
            .then($iframe => {
                const iframe = $iframe.contents();
                const body = iframe.find('body');
                
                cy.wrap(body)
                    .clear()
                    .type(text);
            });
        
        return this;
    }

    formatText(format) {
        const button = format === 'bold' ? 
            this.selectors.boldButton : 
            this.selectors.italicButton;
            
        cy.get(button)
            .should('be.visible')
            .click();
            
        return this;
    }

    verifyIframeContent(selector, expectedText) {
        cy.get(this.selectors.textEditor)
            .should('be.visible')
            .then($iframe => {
                const iframe = $iframe.contents();
                cy.wrap(iframe.find(`body ${selector}`))
                    .should('have.text', expectedText);
            });
            
        return this;
    }

    getFrameContent(frameSelector) {
        return cy.get(frameSelector)
            .its('0.contentDocument.body')
            .should('not.be.empty');
    }

    verifyFrameContent(frameSelector, expectedText) {
        this.getFrameContent(frameSelector)
            .should('contain', expectedText);
            
        return this;
    }
}

export default new ComplexInteractionsPage();