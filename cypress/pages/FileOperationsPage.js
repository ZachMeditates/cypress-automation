// cypress/pages/FileOperationsPage.js

class FileOperationsPage {
    selectors = {
        // Upload elements
        uploadInput: '#file-upload',
        uploadButton: '#file-submit',
        uploadedFiles: '#uploaded-files',
        dragDropArea: '#drag-drop-upload',
        
        // Download elements
        downloadLink: '.download',
        downloadButton: '.download-button',
        
        // Status elements
        successMessage: '.success',
        errorMessage: '.error'
    };

    /**
     * Visit the file upload page
     */
    visitUploadPage() {
        cy.visit('/upload');
        return this;
    }

    /**
     * Visit the file download page
     */
    visitDownloadPage() {
        cy.visit('/download');
        return this;
    }

    /**
     * Upload a file using input element
     * @param {string} filePath - Path to file to upload
     */
    uploadFile(filePath) {
        cy.get(this.selectors.uploadInput).selectFile(filePath);
        cy.get(this.selectors.uploadButton).click();
        return this;
    }

    /**
     * Upload a file using drag and drop
     * @param {string} filePath - Path to file to upload
     */
    dragAndDropFile(filePath) {
        cy.get(this.selectors.uploadInput).selectFile(filePath, { action: 'drag-drop' });
        return this;
    }

    /**
     * Verify file was uploaded successfully
     * @param {string} fileName - Name of uploaded file
     */
    verifyUploadSuccess(fileName) {
        cy.get(this.selectors.uploadedFiles)
            .should('be.visible')
            .and('contain', fileName);
        return this;
    }

    /**
     * Download a file
     * @param {string} fileName - Name of file to download
     */
    downloadFile(fileName) {
        cy.get(this.selectors.downloadLink)
            .contains(fileName)
            .click();
        return this;
    }

    /**
     * Verify file exists in downloads
     * @param {string} fileName - Name of downloaded file
     */
    verifyFileDownloaded(fileName) {
        // This requires additional Cypress configuration for downloads
        cy.readFile(`cypress/downloads/${fileName}`).should('exist');
        return this;
    }
}

export default new FileOperationsPage();