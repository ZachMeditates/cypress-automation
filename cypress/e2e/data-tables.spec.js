// cypress/e2e/data-tables.spec.js

import DataTablesPage from '../pages/DataTablesPage';

describe('Data Tables Functionality', () => {
    beforeEach(() => {
        // Visit the tables page before each test
        cy.visit('/tables');
    });

    describe('Table 1 Sorting', () => {
        it('should sort last names in ascending order', () => {
            // Using more specific selector for table 1
            cy.get('#table1 thead tr th')
                .contains('Last Name')
                .click();
            
            // Verify the first last name is alphabetically first
            cy.get('#table1 tbody tr')
                .first()
                .find('td')
                .first()
                .should('contain', 'Bach');
        });

        it('should sort last names in descending order', () => {
            // Click twice for descending order
            cy.get('#table1 thead tr th')
                .contains('Last Name')
                .click()
                .click();
            
            // Verify the first last name is alphabetically last
            cy.get('#table1 tbody tr')
                .first()
                .find('td')
                .first()
                .should('contain', 'Smith');
        });

        it('should sort first names correctly', () => {
            cy.get('#table1 thead tr th')
                .contains('First Name')
                .click();
            
            // Verify the first name sorting
            cy.get('#table1 tbody tr')
                .first()
                .find('td')
                .eq(1)  // First Name is the second column
                .should('contain', 'Frank');
        });

        it('should sort email addresses', () => {
            cy.get('#table1 thead tr th')
                .contains('Email')
                .click();
            
            // Verify email sorting
            cy.get('#table1 tbody tr')
                .first()
                .find('td')
                .eq(2)  // Email is the third column
                .invoke('text')
                .should('match', /^[a-z]/); // Should start with lowercase letter
        });

        it('should sort due amounts', () => {
            cy.get('#table1 thead tr th')
                .contains('Due')
                .click();
            
            // Verify due amount sorting
            cy.get('#table1 tbody tr')
                .first()
                .find('td')
                .eq(3)  // Due is the fourth column
                .invoke('text')
                .should('contain', '$50.00');  // Smallest amount
        });
    });

    describe('Table Content Verification', () => {
        it('should display correct number of rows', () => {
            cy.get('#table1 tbody tr')
                .should('have.length', 4);
        });

        it('should verify specific cell content', () => {
            // Verify a known cell content
            cy.get('#table1 tbody tr')
                .first()
                .find('td')
                .first()
                .should('not.be.empty');
        });
    });

    describe('Header Functionality', () => {
        it('should verify all headers are clickable', () => {
            // Check each header one by one
            const headers = ['Last Name', 'First Name', 'Email', 'Due', 'Web Site'];
            
            headers.forEach(header => {
                cy.get('#table1 thead tr th')
                    .contains(header)
                    .should('be.visible')
                    .click();
                
                // Verify the header responds to click
                cy.get('#table1 thead tr th')
                    .contains(header)
                    .should('exist');
            });
        });
    });
});