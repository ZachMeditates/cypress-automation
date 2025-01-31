// cypress/pages/DataTablesPage.js

class DataTablesPage {
    selectors = {
        // Table 1 selectors
        table1: '#table1',
        table1Headers: '#table1 th',
        table1Rows: '#table1 tbody tr',
        table1Cells: '#table1 tbody td',
        
        // Table 2 selectors
        table2: '#table2',
        table2Headers: '#table2 th',
        table2Rows: '#table2 tbody tr',
        table2Cells: '#table2 tbody td',

        // Common selectors
        sortableHeaders: 'th.header',
        columnHeader: (name) => `th:contains("${name}")`,
        cellByRowCol: (row, col) => `tbody tr:nth-child(${row}) td:nth-child(${col})`
    };

    /**
     * Visit the data tables page
     */
    visit() {
        cy.visit('/tables');
        return this;
    }

    /**
     * Click on a column header to sort
     * @param {string} columnName - Name of the column to sort
     */
    sortByColumn(columnName) {
        cy.get(this.selectors.columnHeader(columnName)).click();
        return this;
    }

    /**
     * Get all values from a specific column
     * @param {string} tableId - The table identifier (#table1 or #table2)
     * @param {number} columnIndex - The index of the column (1-based)
     */
    getColumnValues(tableId, columnIndex) {
        return cy.get(`${tableId} tbody tr td:nth-child(${columnIndex})`).then($cells => {
            return Cypress._.map($cells, cell => cell.innerText.trim());
        });
    }

    /**
     * Verify column is sorted in specified order
     * @param {string} tableId - The table identifier (#table1 or #table2)
     * @param {number} columnIndex - The index of the column (1-based)
     * @param {string} order - The expected order ('asc' or 'desc')
     */
    verifyColumnOrder(tableId, columnIndex, order) {
        this.getColumnValues(tableId, columnIndex).then(values => {
            const sorted = [...values].sort((a, b) => {
                // Handle numeric sorting if needed
                if (!isNaN(a) && !isNaN(b)) {
                    return order === 'asc' ? Number(a) - Number(b) : Number(b) - Number(a);
                }
                // String sorting
                return order === 'asc' ? 
                    a.localeCompare(b) : 
                    b.localeCompare(a);
            });

            // Compare original and sorted arrays
            if (order === 'asc') {
                expect(values).to.deep.equal(sorted);
            } else {
                expect(values).to.deep.equal(sorted);
            }
        });
        return this;
    }

    /**
     * Get cell content by row and column index
     * @param {string} tableId - The table identifier (#table1 or #table2)
     * @param {number} row - Row index (1-based)
     * @param {number} col - Column index (1-based)
     */
    getCellContent(tableId, row, col) {
        return cy.get(`${tableId} ${this.selectors.cellByRowCol(row, col)}`);
    }

    /**
     * Get number of rows in table
     * @param {string} tableId - The table identifier (#table1 or #table2)
     */
    getRowCount(tableId) {
        return cy.get(`${tableId} tbody tr`).its('length');
    }

    /**
     * Verify header exists and is sortable
     * @param {string} columnName - Name of the column
     */
    verifySortableHeader(columnName) {
        cy.get(this.selectors.columnHeader(columnName))
            .should('exist')
            .and('have.class', 'header');
        return this;
    }
}

export default new DataTablesPage();