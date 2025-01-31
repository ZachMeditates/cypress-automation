// cypress/pages/DynamicLoadingPage.js

class DynamicLoadingPage {
    selectors = {
        // Example 1: Element on page that is hidden
        example1Link: 'a[href="/dynamic_loading/1"]',
        // Example 2: Element rendered after the fact
        example2Link: 'a[href="/dynamic_loading/2"]',
        
        startButton: '#start button',
        loading: '#loading',
        finishText: '#finish',
        
        // Additional elements
        pageContent: '.example',
        errorMessage: '.error'
    };

    /**
     * Visit the dynamic loading page
     */
    visit() {
        cy.visit('/dynamic_loading');
        return this;
    }

    /**
     * Visit specific example directly
     * @param {number} example - Example number (1 or 2)
     */
    visitExample(example) {
        cy.visit(`/dynamic_loading/${example}`);
        return this;
    }

    /**
     * Click the start button
     */
    clickStart() {
        cy.get(this.selectors.startButton).click();
        return this;
    }

    /**
     * Wait for loading to complete
     */
    waitForLoad() {
        // Wait for loading indicator to appear and then disappear
        cy.get(this.selectors.loading).should('be.visible');
        cy.get(this.selectors.loading).should('not.exist');
        return this;
    }

    /**
     * Get the finish text element
     */
    getFinishText() {
        return cy.get(this.selectors.finishText);
    }

    /**
     * Complete full loading sequence
     */
    completeLoading() {
        this.clickStart()
            .waitForLoad();
        return this;
    }

    /**
     * Verify finish text is correct
     */
    verifyFinishText() {
        this.getFinishText()
            .should('be.visible')
            .and('have.text', 'Hello World!');
        return this;
    }
}

export default new DynamicLoadingPage();