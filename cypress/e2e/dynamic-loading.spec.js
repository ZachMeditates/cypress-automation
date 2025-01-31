// cypress/e2e/dynamic-loading.spec.js

import DynamicLoadingPage from '../pages/DynamicLoadingPage';

describe('Dynamic Loading Tests', () => {
    describe('Example 1: Element Hidden', () => {
        beforeEach(() => {
            DynamicLoadingPage.visitExample(1);
        });

        it('should load hidden element', () => {
            DynamicLoadingPage
                .completeLoading()
                .verifyFinishText();
        });

        it('should handle multiple rapid clicks', () => {
            // Click start button multiple times rapidly
            for(let i = 0; i < 3; i++) {
                cy.get(DynamicLoadingPage.selectors.startButton).click({ force: true });
            }

            DynamicLoadingPage
                .waitForLoad()
                .verifyFinishText();
        });

        it('should handle page navigation during loading', () => {
            DynamicLoadingPage.clickStart();

            // Navigate away and back during loading
            cy.visit('/');
            cy.go('back');

            // Verify we can start again
            DynamicLoadingPage
                .completeLoading()
                .verifyFinishText();
        });
    });

    describe('Example 2: Element Rendered After Loading', () => {
        beforeEach(() => {
            DynamicLoadingPage.visitExample(2);
        });

        it('should render new element', () => {
            DynamicLoadingPage
                .completeLoading()
                .verifyFinishText();
        });

        it('should handle network latency', () => {
            // Intercept and delay the response
            cy.intercept('/dynamic_loading/2', (req) => {
                req.on('response', (res) => {
                    res.setDelay(2000);
                });
            });

            DynamicLoadingPage
                .completeLoading()
                .verifyFinishText();
        });
    });

    describe('Network Condition Handling', () => {
        it('should handle slow network responses', () => {
            cy.intercept('/dynamic_loading/*', (req) => {
                req.on('response', (res) => {
                    res.setDelay(3000);
                });
            });

            DynamicLoadingPage
                .visitExample(1)
                .completeLoading()
                .verifyFinishText();
        });

        it('should handle network failures', () => {
            // Intercept first request and fail it
            let requestCount = 0;
            cy.intercept('/dynamic_loading/*', (req) => {
                requestCount++;
                if (requestCount === 1) {
                    req.destroy();
                }
            });

            DynamicLoadingPage
                .visitExample(1)
                .completeLoading()
                .verifyFinishText();
        });
    });

    describe('User Interaction During Loading', () => {
        it('should handle scroll events during loading', () => {
            DynamicLoadingPage.visitExample(1);
            
            DynamicLoadingPage.clickStart();
            
            // Scroll while loading
            cy.scrollTo('bottom');
            cy.scrollTo('top');

            DynamicLoadingPage
                .waitForLoad()
                .verifyFinishText();
        });

        it('should handle tab switching during loading', () => {
            DynamicLoadingPage.visitExample(1);
            
            DynamicLoadingPage.clickStart();

            // Simulate tab blur/focus
            cy.document().trigger('visibilitychange');
            cy.document().trigger('focus');

            DynamicLoadingPage
                .waitForLoad()
                .verifyFinishText();
        });
    });
});