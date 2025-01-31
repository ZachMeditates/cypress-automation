// cypress/e2e/visual-shadow.spec.js

import ShadowDomPage from '../pages/ShadowDomPage';

describe('Visual and Shadow DOM Testing', () => {
    describe('Shadow DOM Interactions', () => {
        beforeEach(() => {
            ShadowDomPage.visit();
        });

        it('should interact with shadow DOM elements and verify visually', () => {
            // Take initial snapshot
            cy.takeVisualSnapshot('before-interaction');

            // Interact with shadow DOM elements
            ShadowDomPage
                .typeInShadowInput('Test Input')
                .clickShadowButton();

            // Take snapshot after interactions
            cy.takeVisualSnapshot('after-interaction');
        });

        it('should verify responsive behavior', () => {
            const viewports = [
                { width: 1920, height: 1080, name: 'desktop' },
                { width: 768, height: 1024, name: 'tablet' },
                { width: 375, height: 812, name: 'mobile' }
            ];

            viewports.forEach(viewport => {
                cy.viewport(viewport.width, viewport.height);
                cy.takeVisualSnapshot(`responsive-${viewport.name}`);
            });
        });

        it('should verify shadow DOM styling states', () => {
            // Default state
            cy.takeVisualSnapshot('initial-state');

            // Clicked state
            ShadowDomPage.clickShadowButton();
            cy.takeVisualSnapshot('button-clicked-state');

            // Input filled state
            ShadowDomPage.typeInShadowInput('Style Test');
            cy.takeVisualSnapshot('input-filled-state');
        });
    });
});