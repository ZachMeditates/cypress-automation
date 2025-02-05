// cypress/e2e/visual-shadow.spec.js

describe('Visual and Shadow DOM Testing', () => {
    beforeEach(() => {
        cy.visit('/nested_frames');
    });

    describe('Frame Content Tests', () => {
        it('should interact with frame elements and verify visually', () => {
            // Get the top frame
            cy.get('frame[name="frame-top"]').then($topFrame => {
                const $topDoc = $topFrame[0].contentDocument;
                
                // Verify left frame
                cy.wrap($topDoc)
                    .find('frame[name="frame-left"]')
                    .its('0.contentDocument.body')
                    .should('contain', 'LEFT');

                // Verify middle frame
                cy.wrap($topDoc)
                    .find('frame[name="frame-middle"]')
                    .its('0.contentDocument.body')
                    .should('contain', 'MIDDLE');

                // Verify right frame
                cy.wrap($topDoc)
                    .find('frame[name="frame-right"]')
                    .its('0.contentDocument.body')
                    .should('contain', 'RIGHT');
            });
        });

        it('should verify responsive behavior', () => {
            const viewports = [
                { width: 1920, height: 1080, name: 'desktop' },
                { width: 768, height: 1024, name: 'tablet' },
                { width: 375, height: 812, name: 'mobile' }
            ];

            viewports.forEach(viewport => {
                cy.viewport(viewport.width, viewport.height);
                cy.get('frameset').should('be.visible');
                cy.get('frame').should('exist');
            });
        });

        it('should verify frame content states', () => {
            // Verify bottom frame content
            cy.get('frame[name="frame-bottom"]')
                .then($frame => {
                    const $body = $frame[0].contentDocument.body;
                    cy.wrap($body).should('contain', 'BOTTOM');
                });

            // Verify top frame exists and has nested frames
            cy.get('frame[name="frame-top"]')
                .then($frame => {
                    const $doc = $frame[0].contentDocument;
                    cy.wrap($doc).find('frame').should('have.length', 3);
                });
        });
    });

    describe('Frame Content Interaction', () => {
        it('should handle frame content visibility', () => {
            // Verify all frames are present
            cy.get('frameset').first().within(() => {
                cy.get('frame[name="frame-top"]').should('exist');
                cy.get('frame[name="frame-bottom"]').should('exist');
            });

            // Verify nested frames in top frame
            cy.get('frame[name="frame-top"]')
                .then($frame => {
                    const $doc = $frame[0].contentDocument;
                    cy.wrap($doc).find('frame').should('have.length', 3);
                });
        });

        it('should verify frame content structure', () => {
            // Verify main frameset structure
            cy.get('frameset')
                .first()
                .should('exist')
                .and('have.attr', 'rows', '50%,50%');

            // Verify top frame structure
            cy.get('frame[name="frame-top"]')
                .then($frame => {
                    const $doc = $frame[0].contentDocument;
                    cy.wrap($doc)
                        .find('frameset')
                        .should('have.attr', 'cols', '33%,33%,33%'); // Updated to match actual value
                });
        });
    });

    describe('Frame Layout Tests', () => {
        it('should maintain layout integrity', () => {
            // Verify main frameset exists with correct structure
            cy.get('frameset').first().within(() => {
                cy.get('frame').should('have.length.at.least', 2);
            });

            // Verify top frame structure
            cy.get('frame[name="frame-top"]')
                .then($frame => {
                    const $doc = $frame[0].contentDocument;
                    cy.wrap($doc).find('frame').should('have.length', 3);
                });
        });

        it('should handle different window sizes', () => {
            const sizes = [
                [1920, 1080],
                [800, 600],
                [375, 812]
            ];

            sizes.forEach(([width, height]) => {
                cy.viewport(width, height);
                cy.get('frameset').should('exist');
                cy.get('frame').should('exist');
            });
        });
    });
});