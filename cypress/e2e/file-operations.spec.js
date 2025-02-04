// cypress/e2e/file-operations.spec.js

describe('File Operations Tests', () => {
    describe('File Upload Tests', () => {
        beforeEach(() => {
            cy.visit('/upload');
        });

        it('should upload file using button', () => {
            cy.fixture('example.json').then(fileContent => {
                cy.get('#file-upload')
                    .selectFile({
                        contents: Cypress.Buffer.from(JSON.stringify(fileContent)),
                        fileName: 'test-upload.txt',
                        mimeType: 'text/plain'
                    });
            });
            
            cy.get('#file-submit').click();
            cy.get('#uploaded-files', { timeout: 10000 })
                .should('contain', 'test-upload.txt');
        });

        it('should upload file using drag and drop', () => {
            cy.fixture('example.json').then(fileContent => {
                cy.get('#file-upload')
                    .selectFile({
                        contents: Cypress.Buffer.from(JSON.stringify(fileContent)),
                        fileName: 'drag-drop.txt',
                        mimeType: 'text/plain'
                    }, { action: 'drag-drop' });
            });

            cy.get('#file-submit').click();
            cy.get('#uploaded-files', { timeout: 10000 })
                .should('contain', 'drag-drop.txt');
        });

        it('should handle large file upload', () => {
            const largeContent = 'A'.repeat(1024 * 1024);
            cy.get('#file-upload').selectFile({
                contents: Cypress.Buffer.from(largeContent),
                fileName: 'large-file.txt',
                mimeType: 'text/plain'
            });

            cy.get('#file-submit').click();
            cy.get('#uploaded-files', { timeout: 15000 })
                .should('contain', 'large-file.txt');
        });

        it('should handle multiple file upload attempts', () => {
            cy.fixture('example.json').then(fileContent => {
                // First upload
                cy.get('#file-upload')
                    .selectFile({
                        contents: Cypress.Buffer.from(JSON.stringify(fileContent)),
                        fileName: 'file1.txt',
                        mimeType: 'text/plain'
                    });
                
                cy.get('#file-submit').click();
                cy.get('#uploaded-files')
                    .should('contain', 'file1.txt');

                // Second upload
                cy.visit('/upload');
                cy.get('#file-upload')
                    .selectFile({
                        contents: Cypress.Buffer.from(JSON.stringify(fileContent)),
                        fileName: 'file2.txt',
                        mimeType: 'text/plain'
                    });
                
                cy.get('#file-submit').click();
                cy.get('#uploaded-files')
                    .should('contain', 'file2.txt');
            });
        });
    });

    describe('File Download Tests', () => {
        beforeEach(() => {
            // Clear downloads before each test
            cy.exec('rm -rf cypress/downloads/*', { failOnNonZeroExit: false });
        });

        it('should download text file', () => {
            cy.visit('/download');
            
            // Find a .txt file and download it
            cy.contains('a', '.txt')
                .then($a => {
                    // Get the filename from the link
                    const filename = $a.text().trim();
                    // Download the file
                    cy.wrap($a).click({ force: true });
                    // Wait and verify the download
                    cy.readFile(`cypress/downloads/${filename}`, { timeout: 10000 })
                        .should('exist');
                });
        });

        it('should handle multiple downloads', () => {
            cy.visit('/download');
            
            // Get two different .txt files
            cy.get('a[href*=".txt"]')
                .then($links => {
                    // Get first file
                    const firstFile = $links[0].text.trim();
                    cy.wrap($links[0]).click({ force: true });
                    cy.readFile(`cypress/downloads/${firstFile}`, { timeout: 10000 })
                        .should('exist');
                    
                    // Get second file
                    const secondFile = $links[1].text.trim();
                    cy.wrap($links[1]).click({ force: true });
                    cy.readFile(`cypress/downloads/${secondFile}`, { timeout: 10000 })
                        .should('exist');
                });
        });
    });

    describe('Error Handling', () => {
        it('should handle upload errors gracefully', () => {
            cy.visit('/upload');
            
            // Intercept the upload request
            cy.intercept('POST', '/upload', {
                statusCode: 500,
                body: 'Internal Server Error'
            }).as('failedUpload');
            
            // Attempt upload with an empty file
            cy.get('#file-upload').selectFile({
                contents: Cypress.Buffer.from(''),
                fileName: 'empty.txt',
                mimeType: 'text/plain'
            });
            
            cy.get('#file-submit').click();
            
            // Wait for the failed request
            cy.wait('@failedUpload');
            
            // Verify error message or state
            cy.get('body').should(($body) => {
                expect($body.text().toLowerCase()).to.match(/error|fail|invalid/);
            });
        });

        it('should handle download errors gracefully', () => {
            cy.visit('/download');
            
            // Intercept requests to non-existent files
            cy.intercept('GET', '/download/nonexistent.txt', {
                statusCode: 404,
                body: 'Not Found'
            }).as('failedDownload');
            
            // Create and click a non-existent file link
            cy.window().then((win) => {
                const link = win.document.createElement('a');
                link.href = '/download/nonexistent.txt';
                link.text = 'Nonexistent File';
                win.document.body.appendChild(link);
            });
            
            cy.get('a[href="/download/nonexistent.txt"]').click({ force: true });
            cy.wait('@failedDownload').its('response.statusCode').should('eq', 404);
        });
    });

    describe('Network Conditions', () => {
        it('should handle slow upload speeds', () => {
            cy.visit('/upload');
            
            // Intercept with delay
            cy.intercept('POST', '/upload', (req) => {
                req.on('response', (res) => {
                    res.setDelay(2000);
                });
            }).as('slowUpload');
            
            cy.fixture('example.json').then(fileContent => {
                cy.get('#file-upload').selectFile({
                    contents: Cypress.Buffer.from(JSON.stringify(fileContent)),
                    fileName: 'slow-test.txt',
                    mimeType: 'text/plain'
                });
            });
            
            cy.get('#file-submit').click();
            cy.wait('@slowUpload', { timeout: 10000 });
            cy.get('#uploaded-files').should('contain', 'slow-test.txt');
        });

        it('should handle slow download speeds', () => {
            cy.visit('/download');
            
            // Intercept download request with delay
            cy.intercept('GET', '/download/**', (req) => {
                req.on('response', (res) => {
                    res.setDelay(2000);
                });
            }).as('slowDownload');
            
            // Find and click first .txt file
            cy.contains('a', '.txt').then($a => {
                const filename = $a.text().trim();
                cy.wrap($a).click({ force: true });
                cy.wait('@slowDownload', { timeout: 10000 });
                cy.readFile(`cypress/downloads/${filename}`, { timeout: 15000 })
                    .should('exist');
            });
        });
    });
});