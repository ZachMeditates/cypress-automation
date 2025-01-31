// cypress/e2e/table-negative.spec.js

import DataTablesPage from '../pages/DataTablesPage';

describe('Table Negative Testing Scenarios', () => {
    beforeEach(() => {
        DataTablesPage.visit();
    });

    describe('Sorting Edge Cases', () => {
        it('should handle rapid multiple clicks on different headers', () => {
            // Rapidly click different column headers
            ['Last Name', 'First Name', 'Email', 'Due'].forEach(header => {
                for (let i = 0; i < 3; i++) {
                    cy.get(DataTablesPage.selectors.columnHeader(header)).click();
                }
            });

            // Verify table remains functional
            cy.get('#table1 tbody tr').should('exist');
            cy.get('#table1 tbody tr').should('have.length.gt', 0);
        });

        it('should handle simultaneous sort attempts', () => {
            // Attempt to trigger multiple sorts quickly
            cy.get('#table1 th').each(($header) => {
                cy.wrap($header).click({ force: true });
            });

            // Verify table integrity
            cy.get('#table1 tbody tr').should('exist');
            DataTablesPage.getRowCount('#table1').then(count => {
                expect(count).to.be.gt(0);
            });
        });
    });

    describe('Data Anomaly Handling', () => {
        it('should handle special characters in sorting', () => {
            // Mock data with special characters
            const specialChars = [
                'Smith!@#',
                'Doe$%^',
                'Brown&*()',
                'Jones<>?'
            ];

            // Intercept and modify response
            cy.intercept('GET', '/tables', (req) => {
                req.continue((res) => {
                    const body = res.body;
                    // Modify table data (this is conceptual as the actual implementation
                    // would depend on the response structure)
                    specialChars.forEach((char, index) => {
                        if (body.includes('Smith')) {
                            body = body.replace('Smith', specialChars[index]);
                        }
                    });
                    res.send(body);
                });
            });

            // Try sorting
            DataTablesPage.sortByColumn('Last Name');
            cy.get('#table1 tbody tr').should('exist');
        });

        it('should handle empty cells in sorting', () => {
            // Intercept and modify response to include empty cells
            cy.intercept('GET', '/tables', (req) => {
                req.continue((res) => {
                    const body = res.body;
                    // Modify some cells to be empty
                    if (body.includes('Smith')) {
                        body = body.replace('Smith', '');
                    }
                    res.send(body);
                });
            });

            // Verify sorting still works
            DataTablesPage.sortByColumn('Last Name');
            cy.get('#table1 tbody tr').should('exist');
        });
    });

    describe('UI Interaction Edge Cases', () => {
        it('should handle text selection during sort', () => {
            // Attempt to select text while sorting
            cy.get('#table1 th').first()
                .trigger('mousedown')
                .trigger('mousemove')
                .trigger('mouseup');

            cy.get('#table1 th').first().click();

            // Verify table remains functional
            cy.get('#table1 tbody tr').should('exist');
        });

        it('should handle scrolling during sort operations', () => {
            // Force table to be scrollable
            cy.get('#table1').invoke('css', 'height', '100px');
            cy.get('#table1').invoke('css', 'overflow-y', 'scroll');

            // Scroll while sorting
            cy.get('#table1').scrollTo('bottom');
            DataTablesPage.sortByColumn('Last Name');
            cy.get('#table1').scrollTo('top');
            DataTablesPage.sortByColumn('First Name');

            // Verify table integrity
            cy.get('#table1 tbody tr').should('exist');
        });
    });

    describe('Browser Stress Testing', () => {
        it('should handle rapid page refreshes during sort', () => {
            // Start sorting operation
            DataTablesPage.sortByColumn('Last Name');
            
            // Immediately refresh page
            cy.reload();

            // Verify table recovers
            cy.get('#table1 tbody tr').should('exist');
        });

        it('should handle browser back/forward during operations', () => {
            // Sort, navigate away, then back
            DataTablesPage.sortByColumn('Last Name');
            cy.visit('/');
            cy.go('back');

            // Verify table state
            cy.get('#table1 tbody tr').should('exist');
        });
    });

    describe('Data Boundary Testing', () => {
        it('should handle attempting to sort hidden columns', () => {
            // Hide a column using CSS
            cy.get('#table1 th:nth-child(1)').invoke('css', 'display', 'none');
            
            // Attempt to sort hidden column
            cy.get('#table1 th:nth-child(1)').click({ force: true });

            // Verify table integrity
            cy.get('#table1 tbody tr').should('exist');
        });

        it('should handle extreme column widths', () => {
            // Set very narrow column width
            cy.get('#table1 th:first').invoke('css', 'width', '10px');
            
            // Attempt to sort
            DataTablesPage.sortByColumn('Last Name');

            // Set very wide column width
            cy.get('#table1 th:first').invoke('css', 'width', '1000px');
            
            // Attempt to sort again
            DataTablesPage.sortByColumn('Last Name');

            // Verify table remains functional
            cy.get('#table1 tbody tr').should('exist');
        });
    });
});