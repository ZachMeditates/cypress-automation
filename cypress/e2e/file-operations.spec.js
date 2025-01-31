// cypress/e2e/file-operations.spec.js

import FileOperationsPage from '../pages/FileOperationsPage';

describe('File Operations Tests', () => {
    describe('File Upload Tests', () => {
        beforeEach(() => {
            FileOperationsPage.visitUploadPage();
        });

        it('should upload file using button', () => {
            // Create a test file
            cy.writeFile('cypress/fixtures/test-upload.txt', 'Hello, World!');

            FileOperationsPage
                .uploadFile('cypress/fixtures/test-upload.txt')
                .verifyUploadSuccess('test-upload.txt');
        });

        it('should upload file using drag and drop', () => {
            // Create a test file
            cy.writeFile('cypress/fixtures/drag-drop.txt', 'Drag and Drop Test');

            FileOperationsPage
                .dragAndDropFile('cypress/fixtures/drag-drop.txt')
                .verifyUploadSuccess('drag-drop.txt');
        });

        it('should handle large file upload', () => {
            // Create a large test file (1MB)
            const largeContent = 'A'.repeat(1024 * 1024);
            cy.writeFile('cypress/fixtures/large-file.txt', largeContent);

            FileOperationsPage
                .uploadFile('cypress/fixtures/large-file.txt')
                .verifyUploadSuccess('large-file.txt');
        });

        it('should handle multiple file upload attempts', () => {
            // Create test files
            cy.writeFile('cypress/fixtures/file1.txt', 'File 1');
            cy.writeFile('cypress/fixtures/file2.txt', 'File 2');

            // Upload first file
            FileOperationsPage
                .uploadFile('cypress/fixtures/file1.txt')
                .verifyUploadSuccess('file1.txt');

            // Navigate back and upload second file
            FileOperationsPage
                .visitUploadPage()
                .uploadFile('cypress/fixtures/file2.txt')
                .verifyUploadSuccess('file2.txt');
        });
    });

    describe('File Download Tests', () => {
        beforeEach(() => {
            FileOperationsPage.visitDownloadPage();
        });

        it('should download text file', () => {
            FileOperationsPage
                .downloadFile('test.txt')
                .verifyFileDownloaded('test.txt');
        });

        it('should handle multiple downloads', () => {
            const files = ['test1.txt', 'test2.txt', 'test3.txt'];

            files.forEach(file => {
                FileOperationsPage
                    .downloadFile(file)
                    .verifyFileDownloaded(file);
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle upload errors gracefully', () => {
            // Intercept upload request and simulate failure
            cy.intercept('POST', '/upload', {
                statusCode: 500,
                body: 'Upload failed'
            });

            cy.writeFile('cypress/fixtures/error-test.txt', 'Error Test');
            
            FileOperationsPage
                .visitUploadPage()
                .uploadFile('cypress/fixtures/error-test.txt');

            // Verify error handling
            cy.get(FileOperationsPage.selectors.errorMessage)
                .should('be.visible');
        });

        it('should handle download errors gracefully', () => {
            // Intercept download request and simulate failure
            cy.intercept('GET', '/download/**', {
                statusCode: 404,
                body: 'File not found'
            });

            FileOperationsPage.visitDownloadPage();
            
            // Attempt download and verify error handling
            cy.get(FileOperationsPage.selectors.downloadLink)
                .first()
                .click();

            cy.get(FileOperationsPage.selectors.errorMessage)
                .should('be.visible');
        });
    });

    describe('Network Conditions', () => {
        it('should handle slow upload speeds', () => {
            cy.intercept('/upload', (req) => {
                req.on('response', (res) => {
                    res.setDelay(3000);
                });
            });

            cy.writeFile('cypress/fixtures/slow-test.txt', 'Slow Upload Test');

            FileOperationsPage
                .uploadFile('cypress/fixtures/slow-test.txt')
                .verifyUploadSuccess('slow-test.txt');
        });

        it('should handle slow download speeds', () => {
            cy.intercept('/download/**', (req) => {
                req.on('response', (res) => {
                    res.setDelay(3000);
                });
            });

            FileOperationsPage
                .downloadFile('test.txt')
                .verifyFileDownloaded('test.txt');
        });
    });
});