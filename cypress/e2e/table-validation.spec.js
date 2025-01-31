// cypress/e2e/table-validation.spec.js

import DataTablesPage from '../pages/DataTablesPage';

describe('Table Data Validation', () => {
    beforeEach(() => {
        DataTablesPage.visit();
    });

    describe('Data Format Validation', () => {
        it('should validate email format in all rows', () => {
            // Email format regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Get all email cells (column 3)
            cy.get('#table1 tbody tr td:nth-child(3)').each(($cell) => {
                const email = $cell.text().trim();
                expect(email).to.match(emailRegex);
            });
        });

        it('should validate currency format in Due column', () => {
            // Currency format: $XX.XX
            const currencyRegex = /^\$\d+\.\d{2}$/;

            // Get all Due cells (column 4)
            cy.get('#table1 tbody tr td:nth-child(4)').each(($cell) => {
                const amount = $cell.text().trim();
                expect(amount).to.match(currencyRegex);
            });
        });

        it('should validate website URLs', () => {
            // URL format regex
            const urlRegex = /^http(s)?:\/\/[^\s]+$/;

            // Get all website cells (column 5)
            cy.get('#table1 tbody tr td:nth-child(5)').each(($cell) => {
                const url = $cell.text().trim();
                expect(url).to.match(urlRegex);
            });
        });
    });

    describe('Data Consistency Validation', () => {
        it('should validate row data consistency across sorts', () => {
            let initialData = [];

            // Function to get all row data
            const getRowData = () => {
                return cy.get('#table1 tbody tr').then($rows => {
                    const rowData = [];
                    $rows.each((index, row) => {
                        const cells = Cypress.$(row)
                            .find('td')
                            .map((_, cell) => Cypress.$(cell).text().trim())
                            .get();
                        rowData.push(cells);
                    });
                    return rowData;
                });
            };

            // Get initial data
            getRowData().then(data => {
                initialData = data;
            });

            // Sort by each column and verify data consistency
            const columns = ['Last Name', 'First Name', 'Email', 'Due', 'Web Site'];
            columns.forEach(column => {
                // Find and click the specific column header
                cy.get('#table1 thead th')
                    .contains(column)
                    .click()
                    .wait(500); // Wait for sort to complete
                
                getRowData().then(sortedData => {
                    // Check if all initial rows exist after sorting
                    initialData.forEach(initialRow => {
                        const rowExists = sortedData.some(sortedRow => 
                            initialRow.every((cell, index) => cell === sortedRow[index])
                        );
                        expect(rowExists).to.be.true;
                    });
                });
            });
        });

        it('should validate unique values where appropriate', () => {
            // Check for unique emails
            const emails = new Set();
            cy.get('#table1 tbody tr td:nth-child(3)').each(($cell) => {
                const email = $cell.text().trim();
                emails.add(email);
            }).then(() => {
                // Verify each email appears only once
                cy.get('#table1 tbody tr td:nth-child(3)').its('length').then((totalEmails) => {
                    expect(emails.size).to.equal(totalEmails);
                });
            });
        });
    });

    describe('Data Range and Boundary Validation', () => {
        it('should validate Due amounts are within reasonable range', () => {
            cy.get('#table1 tbody tr td:nth-child(4)').each(($cell) => {
                const amount = parseFloat($cell.text().replace('$', ''));
                expect(amount).to.be.at.least(0); // No negative amounts
                expect(amount).to.be.at.most(100); // Assuming $100 is max
            });
        });

        it('should validate text field lengths', () => {
            cy.get('#table1 tbody tr').each(($row) => {
                // Last Name validation
                cy.wrap($row).find('td:nth-child(1)').invoke('text').then((text) => {
                    expect(text.trim().length).to.be.at.least(2);
                    expect(text.trim().length).to.be.at.most(50);
                });

                // First Name validation
                cy.wrap($row).find('td:nth-child(2)').invoke('text').then((text) => {
                    expect(text.trim().length).to.be.at.least(2);
                    expect(text.trim().length).to.be.at.most(50);
                });
            });
        });
    });

    describe('Cross-Field Validation', () => {
        it('should validate email matches name pattern where applicable', () => {
            cy.get('#table1 tbody tr').each(($row) => {
                const firstName = $row.find('td:nth-child(2)').text().trim().toLowerCase();
                const email = $row.find('td:nth-child(3)').text().trim().toLowerCase();
                
                // Check if email contains part of the first name
                expect(email).to.include(firstName[0]); // At least first letter
            });
        });
    });

    describe('Data Type Validation', () => {
        it('should validate proper data types in each column', () => {
            cy.get('#table1 tbody tr').each(($row) => {
                // Due amount should be convertible to number
                const dueText = $row.find('td:nth-child(4)').text().trim().replace('$', '');
                expect(parseFloat(dueText)).to.be.a('number');

                // Website should be valid URL
                const website = $row.find('td:nth-child(5)').text().trim();
                expect(() => new URL(website)).to.not.throw();
            });
        });
    });
});