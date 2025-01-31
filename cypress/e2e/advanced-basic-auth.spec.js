// cypress/e2e/advanced-basic-auth.spec.js

import BasicAuthPage from '../pages/BasicAuthPage';

describe('Advanced Basic Authentication Scenarios', () => {
    describe('Edge Cases', () => {
        it('should handle empty credentials', () => {
            cy.on('fail', (error) => {
                expect(error.message).to.include('401');
                return false;
            });

            cy.visit('/basic_auth', {
                auth: {
                    username: '',
                    password: ''
                },
                failOnStatusCode: false
            });
        });

        it('should handle special characters in credentials', () => {
            cy.on('fail', (error) => {
                expect(error.message).to.include('401');
                return false;
            });

            cy.visit('/basic_auth', {
                auth: {
                    username: 'admin@#$',
                    password: 'pass @#$'
                },
                failOnStatusCode: false
            });
        });

        it('should handle very long credentials', () => {
            const longString = 'a'.repeat(1000);
            
            cy.on('fail', (error) => {
                expect(error.message).to.include('401');
                return false;
            });

            cy.visit('/basic_auth', {
                auth: {
                    username: longString,
                    password: longString
                },
                failOnStatusCode: false
            });
        });
    });

    describe('Session and Navigation Scenarios', () => {
        it('should maintain auth state during page refresh', () => {
            // Initial visit with auth
            cy.visit('/basic_auth', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            });

            // Verify initial auth
            cy.get('p').should('contain', 'Congratulations');

            // Refresh the page with same auth
            cy.visit('/basic_auth', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            });

            // Verify still authenticated
            cy.get('p').should('contain', 'Congratulations');
        });

        it('should maintain auth during navigation sequence', () => {
            // Initial auth
            cy.visit('/basic_auth', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            });

            // Navigate through multiple pages
            cy.visit('/');
            cy.visit('/basic_auth', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            });

            // Verify still authenticated
            cy.get('p').should('contain', 'Congratulations');
        });

        it('should handle rapid page switches with auth', () => {
            const pages = ['/basic_auth', '/', '/basic_auth'];
            
            pages.forEach(page => {
                cy.visit(page, {
                    auth: page === '/basic_auth' ? {
                        username: 'admin',
                        password: 'admin'
                    } : undefined
                });
                
                if (page === '/basic_auth') {
                    cy.get('p').should('contain', 'Congratulations');
                }
            });
        });
    });

    describe('Network and Timing Scenarios', () => {
        it('should handle slow network conditions', () => {
            // Simulate slow network
            cy.intercept('/basic_auth', (req) => {
                req.on('response', (res) => {
                    res.setDelay(2000);
                });
            }).as('slowAuth');

            cy.visit('/basic_auth', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            });

            cy.wait('@slowAuth');
            cy.get('p').should('contain', 'Congratulations');
        });

        it('should retry failed auth attempts with network issues', () => {
            let attemptCount = 0;
            
            cy.intercept('/basic_auth', (req) => {
                attemptCount++;
                if (attemptCount === 1) {
                    req.destroy();
                }
            }).as('failedAuth');

            cy.visit('/basic_auth', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            });

            cy.get('p').should('contain', 'Congratulations');
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

            cy.visit('/basic_auth', {
                auth: {
                    username: xssCredentials.username,
                    password: xssCredentials.password
                },
                failOnStatusCode: false
            });
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

            cy.visit('/basic_auth', {
                auth: {
                    username: sqlInjectionCredentials.username,
                    password: sqlInjectionCredentials.password
                },
                failOnStatusCode: false
            });
        });
    });
});