// cypress/e2e/table-negative.spec.js

describe('Table Negative Testing Scenarios', () => {
    beforeEach(() => {
        cy.visit('/tables');
    });

    describe('Sorting Edge Cases', () => {
        it('should handle rapid multiple clicks on different headers', () => {
            // Click different headers rapidly but with small delays
            const headers = ['Last Name', 'First Name', 'Email', 'Due'];
            headers.forEach(header => {
                cy.get('#table1 th').contains(header).click();
                cy.wait(100);
            });

            // Verify table still exists and has data
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });

        it('should handle simultaneous sort attempts', () => {
            // Click all headers in quick succession
            cy.get('#table1 th').each($header => {
                cy.wrap($header).click({ force: true });
            });

            // Verify table remains intact
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });
    });

    describe('Data Anomaly Handling', () => {
        it('should handle special characters in sorting', () => {
            // Sort by Last Name column
            cy.get('#table1 th').contains('Last Name').click();
            
            // Verify table maintains structure
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
            
            // Sort again to test reverse order
            cy.get('#table1 th').contains('Last Name').click();
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });

        it('should handle empty cells in sorting', () => {
            // Sort by Due column which might have empty cells
            cy.get('#table1 th').contains('Due').click();
            
            // Verify table structure remains intact
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
            
            // Test reverse sort
            cy.get('#table1 th').contains('Due').click();
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });
    });

    describe('UI Interaction Edge Cases', () => {
        it('should handle text selection during sort', () => {
            // Simulate text selection on header
            cy.get('#table1 th').contains('Last Name')
                .trigger('mousedown')
                .trigger('mousemove', { clientX: 100, clientY: 0 })
                .trigger('mouseup');

            // Sort and verify
            cy.get('#table1 th').contains('Last Name').click();
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });

        it('should handle scrolling during sort operations', () => {
            // Create a wrapper div for scrolling
            cy.get('#table1').parent()
                .invoke('css', 'height', '200px')
                .invoke('css', 'overflow-y', 'auto')
                .invoke('css', 'display', 'block');

            // Sort, scroll, and sort again
            cy.get('#table1 th').contains('Last Name').click();
            cy.get('#table1').parent().scrollTo(0, 100, { ensureScrollable: false });
            cy.get('#table1 th').contains('Last Name').click();

            // Verify table integrity
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });
    });

    describe('Browser Stress Testing', () => {
        it('should handle rapid page refreshes during sort', () => {
            // Sort and quickly refresh
            cy.get('#table1 th').contains('Last Name').click();
            cy.reload();

            // Verify table recovers and can still sort
            cy.get('#table1').should('be.visible');
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
            cy.get('#table1 th').contains('Last Name').click();
        });

        it('should handle browser back/forward during operations', () => {
            // Initial sort
            cy.get('#table1 th').contains('Last Name').click();
            
            // Navigate away and back
            cy.visit('/');
            cy.go('back');

            // Verify table is functional
            cy.get('#table1').should('be.visible');
            cy.get('#table1 th').contains('Last Name').click();
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });
    });

    describe('Data Boundary Testing', () => {
        it('should handle attempting to sort hidden columns', () => {
            // Hide first column
            cy.get('#table1 th').first().invoke('css', 'visibility', 'hidden');
            
            // Try to sort hidden column
            cy.get('#table1 th').first().click({ force: true });

            // Verify table integrity
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });

        it('should handle extreme column widths', () => {
            // Test with narrow column
            cy.get('#table1 th').first()
                .invoke('css', 'width', '10px');
            cy.get('#table1 th').contains('Last Name').click();
            
            // Verify table structure
            cy.get('#table1 tbody tr').should('have.length.gt', 0);

            // Test with wide column
            cy.get('#table1 th').first()
                .invoke('css', 'width', '500px');
            cy.get('#table1 th').contains('Last Name').click();
            
            // Verify table structure again
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });
    });
});