// cypress/e2e/browser-compatibility.spec.js

describe('Browser Compatibility Edge Cases', () => {
    beforeEach(() => {
        // Block analytics/tracking requests that might interfere with tests
        cy.intercept('**.log.optimizely.com**', {statusCode: 200}).as('blockAnalytics');
        cy.intercept('**/analytics/**', {statusCode: 200}).as('blockAnalytics2');
        
        // Visit the page
        cy.visit('/tables');
    });

    describe('Viewport Testing', () => {
        const viewports = [
            { width: 320, height: 568, name: 'mobile-portrait' },    // iPhone SE
            { width: 568, height: 320, name: 'mobile-landscape' },   // iPhone SE landscape
            { width: 768, height: 1024, name: 'tablet-portrait' },   // iPad
            { width: 1024, height: 768, name: 'tablet-landscape' },  // iPad landscape
            { width: 1920, height: 1080, name: 'desktop-full-hd' }   // Full HD
        ];

        viewports.forEach((viewport) => {
            it(`should maintain table functionality in ${viewport.name} viewport`, () => {
                // Set viewport
                cy.viewport(viewport.width, viewport.height);

                // Wait for table to be ready
                cy.get('#table1').should('be.visible');

                // Basic table interaction tests
                cy.get('#table1 th').contains('Last Name').click();
                
                // Verify table remains functional
                cy.get('#table1 tbody tr').should('be.visible');
                
                // Verify all important elements are accessible
                cy.get('#table1 th').each(($th) => {
                    // Check if header is at least partially visible
                    cy.wrap($th).should('be.visible');
                });
            });
        });
    });

    describe('CSS Feature Detection', () => {
        it('should handle different text sizes', () => {
            const fontSizes = ['12px', '16px', '20px'];
            
            fontSizes.forEach(size => {
                cy.get('#table1').invoke('css', 'font-size', size);
                
                // Verify content remains visible
                cy.get('#table1 tbody tr td').first().should('be.visible');
            });
        });

        it('should handle high contrast mode', () => {
            // Add high contrast styles
            cy.get('#table1').invoke('css', {
                'background-color': '#000',
                'color': '#fff'
            });

            // Verify table remains usable
            cy.get('#table1 tbody tr').should('be.visible');
        });
    });

    describe('Touch Device Simulation', () => {
        it('should handle touch events for sorting', () => {
            // Trigger touch events on column header
            cy.get('#table1 th').first()
                .trigger('touchstart')
                .trigger('touchend');

            // Verify table remains responsive
            cy.get('#table1 tbody tr').should('be.visible');
        });
    });
});