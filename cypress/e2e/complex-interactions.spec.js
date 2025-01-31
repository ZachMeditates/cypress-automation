// cypress/e2e/complex-interactions.spec.js

import ComplexInteractionsPage from '../pages/ComplexInteractionsPage';

describe('Complex Interactions', () => {
    describe('Drag and Drop Operations', () => {
        beforeEach(() => {
            ComplexInteractionsPage.visitDragAndDrop();
        });

        it('should swap columns using drag and drop', () => {
            // Get initial text values
            cy.get('#column-a').invoke('text').as('initialTextA');
            cy.get('#column-b').invoke('text').as('initialTextB');

            // Perform drag and drop
            ComplexInteractionsPage.dragAndDrop(
                ComplexInteractionsPage.selectors.columnA,
                ComplexInteractionsPage.selectors.columnB
            );

            // Verify columns have swapped
            cy.get('@initialTextA').then(textA => {
                cy.get('#column-b').should('have.text', textA);
            });

            cy.get('@initialTextB').then(textB => {
                cy.get('#column-a').should('have.text', textB);
            });
        });
    });

    describe('iFrame Interactions', () => {
        beforeEach(() => {
            ComplexInteractionsPage.visitIframePage();
        });

        it('should type and format text in iframe', () => {
            const testText = 'Testing iframe interactions';

            ComplexInteractionsPage
                .typeInIframe(testText)
                .formatText('bold');

            // Verify text and formatting
            cy.get('#mce_0_ifr')
                .its('0.contentDocument.body')
                .find('strong')
                .should('have.text', testText);
        });

        it('should handle multiple formatting options', () => {
            const testText = 'Multiple formats test';

            ComplexInteractionsPage
                .typeInIframe(testText)
                .formatText('bold')
                .formatText('italic');

            // Verify multiple formats
            cy.get('#mce_0_ifr')
                .its('0.contentDocument.body')
                .find('strong em')
                .should('have.text', testText);
        });
    });

    describe('Nested Frames', () => {
        beforeEach(() => {
            ComplexInteractionsPage.visitNestedFrames();
        });

        it('should access and verify content in nested frames', () => {
            // Verify top frame content
            ComplexInteractionsPage
                .getFrameText(ComplexInteractionsPage.selectors.topFrame)
                .find(ComplexInteractionsPage.selectors.leftFrame)
                .should('exist');

            // Switch to left frame and verify content
            ComplexInteractionsPage
                .getFrameText(ComplexInteractionsPage.selectors.leftFrame)
                .should('include.text', 'LEFT');

            // Switch to middle frame and verify content
            ComplexInteractionsPage
                .getFrameText(ComplexInteractionsPage.selectors.middleFrame)
                .should('include.text', 'MIDDLE');

            // Switch to right frame and verify content
            ComplexInteractionsPage
                .getFrameText(ComplexInteractionsPage.selectors.rightFrame)
                .should('include.text', 'RIGHT');
        });
    });

    describe('Complex User Interactions', () => {
        it('should perform a sequence of complex interactions', () => {
            // Start with drag and drop
            ComplexInteractionsPage.visitDragAndDrop();
            
            ComplexInteractionsPage.dragAndDrop(
                ComplexInteractionsPage.selectors.columnA,
                ComplexInteractionsPage.selectors.columnB
            );

            // Move to iframe interactions
            ComplexInteractionsPage.visitIframePage();
            
            const complexText = 'Complex interaction test';
            ComplexInteractionsPage
                .typeInIframe(complexText)
                .formatText('bold')
                .formatText('italic');

            // Verify final state
            cy.get('#mce_0_ifr')
                .its('0.contentDocument.body')
                .find('strong em')
                .should('have.text', complexText);
        });
    });
});