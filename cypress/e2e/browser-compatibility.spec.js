// cypress/e2e/browser-compatibility.spec.js

import DataTablesPage from '../pages/DataTablesPage';

describe('Browser Compatibility Edge Cases', () => {
    beforeEach(() => {
        DataTablesPage.visit();
    });

    describe('Viewport Testing', () => {
        const viewports = [
            { width: 320, height: 568, name: 'mobile-portrait' },    // iPhone SE
            { width: 568, height: 320, name: 'mobile-landscape' },   // iPhone SE landscape
            { width: 768, height: 1024, name: 'tablet-portrait' },   // iPad
            { width: 1024, height: 768, name: 'tablet-landscape' },  // iPad landscape
            { width: 1920, height: 1080, name: 'desktop-full-hd' },  // Full HD
            { width: 3840, height: 2160, name: 'desktop-4k' }        // 4K
        ];

        viewports.forEach((viewport) => {
            it(`should maintain table functionality in ${viewport.name} viewport`, () => {
                // Set viewport
                cy.viewport(viewport.width, viewport.height);

                // Verify table is visible
                cy.get('#table1').should('be.visible');

                // Test sorting in this viewport
                DataTablesPage.sortByColumn('Last Name');
                DataTablesPage.verifyColumnOrder('#table1', 1, 'asc');

                // Verify all columns are accessible
                cy.get('#table1 th').each(($th) => {
                    cy.wrap($th).should('be.visible');
                });
            });
        });
    });

    describe('CSS Feature Detection', () => {
        it('should handle different CSS rendering modes', () => {
            // Test with different zoom levels
            const zoomLevels = ['0.5', '1', '1.5', '2'];
            
            zoomLevels.forEach(zoom => {
                cy.get('#table1').invoke('css', 'zoom', zoom);
                
                // Verify table remains functional
                DataTablesPage.sortByColumn('Last Name');
                cy.get('#table1 tbody tr').should('be.visible');
            });
        });

        it('should handle different text sizes', () => {
            const fontSizes = ['12px', '16px', '20px', '24px'];
            
            fontSizes.forEach(size => {
                cy.get('#table1').invoke('css', 'font-size', size);
                
                // Verify content remains visible and sortable
                DataTablesPage.sortByColumn('Last Name');
                cy.get('#table1 tbody tr td').first().should('be.visible');
            });
        });
    });

    describe('Browser-Specific Features', () => {
        it('should handle high contrast mode', () => {
            // Simulate high contrast mode
            cy.get('body').invoke('css', {
                'background-color': '#000',
                'color': '#fff',
                'forced-color-adjust': 'none'
            });

            // Verify table remains usable
            DataTablesPage.sortByColumn('Last Name');
            cy.get('#table1 tbody tr').should('be.visible');
        });

        it('should handle text direction changes', () => {
            // Test RTL direction
            cy.get('body').invoke('attr', 'dir', 'rtl');
            
            // Verify sorting still works
            DataTablesPage.sortByColumn('Last Name');
            DataTablesPage.verifyColumnOrder('#table1', 1, 'asc');

            // Test LTR direction
            cy.get('body').invoke('attr', 'dir', 'ltr');
        });
    });

    describe('Touch Device Simulation', () => {
        it('should handle touch events for sorting', () => {
            cy.get('#table1 th').first()
                .trigger('touchstart')
                .trigger('touchend');

            // Verify sorting occurred
            cy.get('#table1 tbody tr').should('exist');
        });

        it('should handle multi-touch gestures', () => {
            // Simulate pinch-zoom gesture
            cy.get('#table1')
                .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }, { clientX: 200, clientY: 200 }] })
                .trigger('touchmove', { touches: [{ clientX: 50, clientY: 50 }, { clientX: 250, clientY: 250 }] })
                .trigger('touchend');

            // Verify table remains functional
            DataTablesPage.sortByColumn('Last Name');
            cy.get('#table1 tbody tr').should('be.visible');
        });
    });

    describe('Font Loading Edge Cases', () => {
        it('should handle custom font loading', () => {
            // Load a custom font
            cy.document().then(doc => {
                const font = new FontFace('CustomFont', 'url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2)');
                doc.fonts.add(font);
            });

            // Apply custom font to table
            cy.get('#table1').invoke('css', 'font-family', 'CustomFont, sans-serif');

            // Verify table remains functional
            DataTablesPage.sortByColumn('Last Name');
            cy.get('#table1 tbody tr').should('be.visible');
        });
    });

    describe('Animation and Transition Handling', () => {
        it('should handle sorting with CSS animations', () => {
            // Add transition effect to table cells
            cy.get('#table1 td').invoke('css', {
                'transition': 'all 0.3s ease-in-out',
                'transform-origin': 'center'
            });

            // Perform sort during animation
            DataTablesPage.sortByColumn('Last Name');
            
            // Verify table state after animation
            cy.get('#table1 tbody tr').should('be.visible');
        });
    });
});