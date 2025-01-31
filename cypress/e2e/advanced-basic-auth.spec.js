// cypress/e2e/advanced-basic-auth.spec.js

import BasicAuthPage from '../pages/BasicAuthPage';

describe('Advanced Basic Authentication Scenarios', () => {
    const credentials = {
        valid: {
            username: 'admin',
            password: 'admin'
        },
        empty: {
            username: '',
            password: ''
        },
        special: {
            username: 'admin@#$',
            password: 'pass @#$'
        }
    };

    describe('Edge Cases', () => {
        it('should handle empty credentials', () => {
            // Intercept the auth failure
            cy.on('fail', (error) => {
                expect(error.message).to.include('401');
                return false;
            });

            BasicAuthPage.visitWithAuth(
                credentials.empty.username, 
                credentials.empty.password
            );
        });

        it('should handle special characters in credentials', () => {
            cy.on('fail', (error) => {
                expect(error.message).to.include('401');
                return false;
            });

            BasicAuthPage.visitWithAuth(
                credentials.special.username, 
                credentials.special.password
            );
        });

        it('should handle very long credentials', () => {
            const longString = 'a'.repeat(1000);
            
            cy.on('fail', (error) => {
                expect(error.message).to.include('401');
                return false;
            });

            BasicAuthPage.visitWithAuth(longString, longString);
        });
    });

    describe('Session and Navigation Scenarios', () => {
        beforeEach(() => {
            // Start with valid authentication
            BasicAuthPage.visitWithAuth(
                credentials.valid.username, 
                credentials.valid.password
            );
        });

        it('should maintain auth state during page refresh', () => {
            // Verify initial auth
            BasicAuthPage.verifySuccessfulAuth();

            // Refresh the page
            cy.reload();

            // Verify still authenticated
            BasicAuthPage.verifySuccessfulAuth();
        });

        it('should maintain auth during navigation sequence', () => {
            // Navigate through multiple pages
            cy.visit('/');
            cy.visit('/basic_auth', {
                auth: {
                    username: credentials.valid.username,
                    password: credentials.valid.password
                }
            });
            cy.visit('/checkboxes');
            cy.visit('/basic_auth', {
                auth: {
                    username: credentials.valid.username,
                    password: credentials.valid.password
                }
            });

            // Verify still authenticated
            BasicAuthPage.verifySuccessfulAuth();
        });

        it('should handle rapid page switches with auth', () => {
            // Quick navigation sequence
            const pages = ['/basic_auth', '/', '/basic_auth'];
            
            pages.forEach(page => {
                cy.visit(page, {
                    auth: page === '/basic_auth' ? {
                        username: credentials.valid.username,
                        password: credentials.valid.password
                    } : undefined
                });
                
                if (page === '/basic_auth') {
                    BasicAuthPage.verifySuccessfulAuth();
                }
            });
        });
    });

    describe('Network and Timing Scenarios', () => {
        it('should handle slow network conditions', () => {
            // Simulate slow network
            cy.intercept('GET', '/basic_auth', (req) => {
                req.on('response', (res) => {
                    // Delay the response by 2 seconds
                    res.setDelay(2000);
                });
            });

            BasicAuthPage.visitWithAuth(
                credentials.valid.username, 
                credentials.valid.password
            );
            
            BasicAuthPage.verifySuccessfulAuth();
        });

        it('should retry failed auth attempts with network issues', () => {
            let attemptCount = 0;
            
            cy.intercept('GET', '/basic_auth', (req) => {
                attemptCount++;
                if (attemptCount === 1) {
                    req.destroy();
                }
            });

            BasicAuthPage.visitWithAuth(
                credentials.valid.username, 
                credentials.valid.password
            );
            
            BasicAuthPage.verifySuccessfulAuth();
        });
    });

    describe('Security Scenarios', () => {
        it('should handle XSS attempts in credentials', () => {
            const xssCredentials = {
                username: '<script>alert("xss")</script>',
                password: '"><script>alert("xss")</script>'
            };

            cy.on('fail', (error) => {
                expect(error.message).to.include('401');
                return false;
            });

            BasicAuthPage.visitWithAuth(
                xssCredentials.username, 
                xssCredentials.password
            );
        });

        it('should handle SQL injection attempts in credentials', () => {
            const sqlInjectionCredentials = {
                username: "' OR '1'='1",
                password: "' OR '1'='1"
            };

            cy.on('fail', (error) => {
                expect(error.message).to.include('401');
                return false;
            });

            BasicAuthPage.visitWithAuth(
                sqlInjectionCredentials.username, 
                sqlInjectionCredentials.password
            );
        });
    });
});