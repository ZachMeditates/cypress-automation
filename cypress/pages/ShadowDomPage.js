// cypress/pages/ShadowDomPage.js

class ShadowDomPage {
    selectors = {
        // Shadow DOM host elements
        customButton: 'custom-button',
        customInput: 'custom-input',
        customDropdown: 'custom-select',
        
        // Shadow DOM internal elements
        buttonInShadow: 'button',
        inputInShadow: 'input',
        dropdownInShadow: 'select'
    };

    /**
     * Visit the test page with shadow DOM elements
     */
    visit() {
        cy.visit('/shadow_dom');
        return this;
    }

    /**
     * Click button inside shadow DOM
     */
    clickShadowButton() {
        cy.get(this.selectors.customButton)
            .getShadow()
            .find(this.selectors.buttonInShadow)
            .click();
        return this;
    }

    /**
     * Type into input inside shadow DOM
     * @param {string} text - Text to type
     */
    typeInShadowInput(text) {
        cy.get(this.selectors.customInput)
            .getShadow()
            .find(this.selectors.inputInShadow)
            .type(text);
        return this;
    }

    /**
     * Select option in shadow DOM dropdown
     * @param {string} value - Value to select
     */
    selectInShadowDropdown(value) {
        cy.get(this.selectors.customDropdown)
            .getShadow()
            .find(this.selectors.dropdownInShadow)
            .select(value);
        return this;
    }

    /**
     * Get text from shadow DOM element
     * @param {string} selector - Shadow host selector
     * @param {string} innerSelector - Inner element selector
     */
    getShadowText(selector, innerSelector) {
        return cy.get(selector)
            .getShadow()
            .find(innerSelector);
    }
}

export default new ShadowDomPage();