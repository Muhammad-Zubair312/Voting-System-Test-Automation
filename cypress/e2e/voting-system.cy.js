// cypress/e2e/voting-system.cy.js
// Complete E2E Test Suite for Online Voting System
// Author: Hasnain Rasheed (BSEF22M519)

describe('Online Voting System - Complete E2E Test Suite', () => {
  
  beforeEach(() => {
    // Clear localStorage before each test for clean state
    cy.clearLocalStorage();
    cy.visit('/'); // Update with your actual URL
    cy.wait(500); // Allow app to initialize
  });

  // ============================================
  // Test Suite 1: User Registration
  // ============================================
  describe('User Registration Flow', () => {
    
    it('TC-001: Should display registration form', () => {
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-form"]').should('be.visible');
      cy.get('[data-testid="register-fullname"]').should('exist');
      cy.get('[data-testid="register-email"]').should('exist');
      cy.get('[data-testid="register-studentid"]').should('exist');
      cy.get('[data-testid="register-password"]').should('exist');
      cy.get('[data-testid="register-confirm-password"]').should('exist');
    });

    it('TC-002: Should register new user successfully', () => {
      cy.get('[data-testid="tab-register"]').click();
      
      // Fill registration form
      cy.get('[data-testid="register-fullname"]').type('Test User');
      cy.get('[data-testid="register-email"]').type('testuser@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M001');
      cy.get('[data-testid="register-password"]').type('password123');
      cy.get('[data-testid="register-confirm-password"]').type('password123');
      
      // Submit form
      cy.get('[data-testid="register-submit"]').click();
      
      // Verify success
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Registration successful');
      });
      
      // Should redirect to login
      cy.get('[data-testid="login-form"]').should('be.visible');
    });

    it('TC-003: Should show error for empty fields', () => {
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-submit"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'All fields are required');
    });

    it('TC-004: Should show error for password mismatch', () => {
      cy.get('[data-testid="tab-register"]').click();
      
      cy.get('[data-testid="register-fullname"]').type('Test User');
      cy.get('[data-testid="register-email"]').type('test@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M002');
      cy.get('[data-testid="register-password"]').type('password123');
      cy.get('[data-testid="register-confirm-password"]').type('differentpass');
      
      cy.get('[data-testid="register-submit"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'Passwords do not match');
    });

    it('TC-005: Should show error for short password', () => {
      cy.get('[data-testid="tab-register"]').click();
      
      cy.get('[data-testid="register-fullname"]').type('Test User');
      cy.get('[data-testid="register-email"]').type('test@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M003');
      cy.get('[data-testid="register-password"]').type('123');
      cy.get('[data-testid="register-confirm-password"]').type('123');
      
      cy.get('[data-testid="register-submit"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'at least 6 characters');
    });

    it('TC-006: Should prevent duplicate email registration', () => {
      // Register first user
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('First User');
      cy.get('[data-testid="register-email"]').type('duplicate@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M010');
      cy.get('[data-testid="register-password"]').type('password123');
      cy.get('[data-testid="register-confirm-password"]').type('password123');
      cy.get('[data-testid="register-submit"]').click();
      
      cy.wait(1000);
      
      // Try to register with same email
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('Second User');
      cy.get('[data-testid="register-email"]').type('duplicate@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M011');
      cy.get('[data-testid="register-password"]').type('password123');
      cy.get('[data-testid="register-confirm-password"]').type('password123');
      cy.get('[data-testid="register-submit"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Email already registered');
    });
  });

  // ============================================
  // Test Suite 2: User Login & Authentication
  // ============================================
  describe('User Login Flow', () => {
    
    beforeEach(() => {
      // Register a user first for login tests
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('Login Test User');
      cy.get('[data-testid="register-email"]').type('loginuser@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M100');
      cy.get('[data-testid="register-password"]').type('testpass123');
      cy.get('[data-testid="register-confirm-password"]').type('testpass123');
      cy.get('[data-testid="register-submit"]').click();
      cy.wait(1000);
    });

    it('TC-007: Should display login form', () => {
      cy.get('[data-testid="tab-login"]').click();
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('[data-testid="login-email"]').should('exist');
      cy.get('[data-testid="login-password"]').should('exist');
    });

    it('TC-008: Should login successfully with valid credentials', () => {
      cy.get('[data-testid="tab-login"]').click();
      cy.get('[data-testid="login-email"]').type('loginuser@example.com');
      cy.get('[data-testid="login-password"]').type('testpass123');
      cy.get('[data-testid="login-submit"]').click();
      
      // Should redirect to elections page
      cy.get('[data-testid="elections-list"]').should('be.visible');
      cy.contains('Login Test User').should('be.visible');
    });

    it('TC-009: Should show error for invalid credentials', () => {
      cy.get('[data-testid="tab-login"]').click();
      cy.get('[data-testid="login-email"]').type('wrong@example.com');
      cy.get('[data-testid="login-password"]').type('wrongpass');
      cy.get('[data-testid="login-submit"]').click();
      
      cy.get('[data-testid="login-error"]').should('contain', 'Invalid email or password');
    });

    it('TC-010: Should logout successfully', () => {
      // Login first
      cy.get('[data-testid="tab-login"]').click();
      cy.get('[data-testid="login-email"]').type('loginuser@example.com');
      cy.get('[data-testid="login-password"]').type('testpass123');
      cy.get('[data-testid="login-submit"]').click();
      cy.wait(500);
      
      // Logout
      cy.get('[data-testid="logout-button"]').click();
      
      // Should redirect to login page
      cy.get('[data-testid="login-form"]').should('be.visible');
    });
  });

  // ============================================
  // Test Suite 3: Voting Functionality
  // ============================================
  describe('Voting Flow', () => {
    
    beforeEach(() => {
      // Register and login before voting tests
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('Voter User');
      cy.get('[data-testid="register-email"]').type('voter@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M200');
      cy.get('[data-testid="register-password"]').type('voterpass123');
      cy.get('[data-testid="register-confirm-password"]').type('voterpass123');
      cy.get('[data-testid="register-submit"]').click();
      cy.wait(1000);
      
      cy.get('[data-testid="tab-login"]').click();
      cy.get('[data-testid="login-email"]').type('voter@example.com');
      cy.get('[data-testid="login-password"]').type('voterpass123');
      cy.get('[data-testid="login-submit"]').click();
      cy.wait(1000);
    });

    it('TC-011: Should display active elections', () => {
      cy.get('[data-testid="elections-list"]').should('be.visible');
      cy.get('[data-testid="election-e1"]').should('exist');
      cy.contains('General Elections 2024 For Member of National Assembly').should('be.visible');
    });

    it('TC-012: Should cast vote successfully', () => {
      // Click on first candidate's vote button
      cy.get('[data-testid="vote-c1"]').first().click();
      
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Vote cast');
      });
      
      // Should show voted badge
      cy.get('[data-testid="voted-badge"]').should('be.visible');
    });

    it('TC-013: Should prevent duplicate voting', () => {
      // Cast first vote
      cy.get('[data-testid="vote-c1"]').first().click();
      cy.wait(1000);
      
      // Try to vote again - buttons should not be visible
      cy.get('[data-testid="election-e1"]').within(() => {
        cy.get('[data-testid="vote-c1"]').should('not.exist');
        cy.get('[data-testid="voted-badge"]').should('be.visible');
      });
    });

    it('TC-014: Should allow voting in multiple elections', () => {
      // Vote in first election
      cy.get('[data-testid="election-e1"]').within(() => {
        cy.get('[data-testid="vote-c1"]').click();
      });
      cy.wait(1000);
      
      // Vote in second election
      cy.get('[data-testid="election-e2"]').within(() => {
        cy.get('[data-testid="vote-c4"]').click();
      });
      cy.wait(1000);
      
      // Both should show voted badge
      cy.get('[data-testid="election-e1"]').within(() => {
        cy.get('[data-testid="voted-badge"]').should('be.visible');
      });
      cy.get('[data-testid="election-e2"]').within(() => {
        cy.get('[data-testid="voted-badge"]').should('be.visible');
      });
    });
  });

  // ============================================
  // Test Suite 4: Results Display
  // ============================================
  describe('Results Display', () => {
    
    beforeEach(() => {
      // Setup: Register, login, and cast vote
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('Results Viewer');
      cy.get('[data-testid="register-email"]').type('results@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M300');
      cy.get('[data-testid="register-password"]').type('resultpass123');
      cy.get('[data-testid="register-confirm-password"]').type('resultpass123');
      cy.get('[data-testid="register-submit"]').click();
      cy.wait(1000);
      
      cy.get('[data-testid="tab-login"]').click();
      cy.get('[data-testid="login-email"]').type('results@example.com');
      cy.get('[data-testid="login-password"]').type('resultpass123');
      cy.get('[data-testid="login-submit"]').click();
      cy.wait(1000);
      
      // Cast a vote
      cy.get('[data-testid="vote-c1"]').first().click();
      cy.wait(1000);
    });

    it('TC-015: Should display results page', () => {
      cy.get('[data-testid="tab-results"]').click();
      cy.get('[data-testid="results-page"]').should('be.visible');
    });

    it('TC-016: Should show vote counts in results', () => {
      cy.get('[data-testid="tab-results"]').click();
      cy.get('[data-testid="results-e1"]').should('be.visible');
      cy.contains('Total Votes:').should('be.visible');
    });

    it('TC-017: Should show percentage bars in results', () => {
      cy.get('[data-testid="tab-results"]').click();
      cy.get('.bg-gradient-to-r').should('exist'); // Progress bars
    });
  });

  // ============================================
  // Test Suite 5: UI/UX Testing
  // ============================================
  describe('UI/UX Elements', () => {
    
    it('TC-018: Should have responsive navigation tabs', () => {
      cy.get('[data-testid="tab-login"]').should('be.visible');
      cy.get('[data-testid="tab-register"]').should('be.visible');
      
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-form"]').should('be.visible');
      
      cy.get('[data-testid="tab-login"]').click();
      cy.get('[data-testid="login-form"]').should('be.visible');
    });

    it('TC-019: Should display proper headings and branding', () => {
      cy.contains('Secure Online Voting System').should('be.visible');
      cy.contains('Transparent, Secure, and Democratic').should('be.visible');
    });

    it('TC-020: Should show student information in footer', () => {
      cy.contains('Hasnain Rasheed').should('be.visible');
      cy.contains('BSEF22M519').should('be.visible');
    });
  });

  // ============================================
  // Test Suite 6: Data Persistence
  // ============================================
  describe('Data Persistence', () => {
    
    it('TC-021: Should persist user data in localStorage', () => {
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('Persist User');
      cy.get('[data-testid="register-email"]').type('persist@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M400');
      cy.get('[data-testid="register-password"]').type('persistpass123');
      cy.get('[data-testid="register-confirm-password"]').type('persistpass123');
      cy.get('[data-testid="register-submit"]').click();
      
      cy.window().then((win) => {
        const users = JSON.parse(win.localStorage.getItem('votingUsers'));
        expect(users).to.have.length.greaterThan(0);
        expect(users[0].email).to.equal('persist@example.com');
      });
    });

    it('TC-022: Should maintain session after page reload', () => {
      // Register and login
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('Session User');
      cy.get('[data-testid="register-email"]').type('session@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M500');
      cy.get('[data-testid="register-password"]').type('sessionpass123');
      cy.get('[data-testid="register-confirm-password"]').type('sessionpass123');
      cy.get('[data-testid="register-submit"]').click();
      cy.wait(1000);
      
      cy.get('[data-testid="tab-login"]').click();
      cy.get('[data-testid="login-email"]').type('session@example.com');
      cy.get('[data-testid="login-password"]').type('sessionpass123');
      cy.get('[data-testid="login-submit"]').click();
      cy.wait(1000);
      
      // Reload page
      cy.reload();
      
      // Should still be logged in
      cy.get('[data-testid="elections-list"]').should('be.visible');
      cy.contains('Session User').should('be.visible');
    });
  });

  // ============================================
  // Test Suite 7: Security Testing
  // ============================================
  describe('Security Tests', () => {
    
    it('TC-023: Should not show voting options without login', () => {
      cy.get('[data-testid="elections-list"]').should('not.exist');
      cy.get('[data-testid="login-form"]').should('be.visible');
    });

    it('TC-024: Should validate email format', () => {
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('Email Test');
      cy.get('[data-testid="register-email"]').type('invalidemail');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M600');
      cy.get('[data-testid="register-password"]').type('password123');
      cy.get('[data-testid="register-confirm-password"]').type('password123');
      
      // HTML5 validation should prevent submission
      cy.get('[data-testid="register-email"]').then(($input) => {
        expect($input[0].validity.valid).to.be.false;
      });
    });

    it('TC-025: Should require authentication for results', () => {
      // Without login, results tab should not be accessible
      cy.get('[data-testid="tab-results"]').should('not.exist');
    });
  });

  // ============================================
  // Test Suite 8: Complete User Journey
  // ============================================
  describe('Complete User Journey E2E', () => {
    
    it('TC-026: Complete flow from registration to viewing results', () => {
      // Step 1: Register
      cy.get('[data-testid="tab-register"]').click();
      cy.get('[data-testid="register-fullname"]').type('Complete Journey User');
      cy.get('[data-testid="register-email"]').type('journey@example.com');
      cy.get('[data-testid="register-studentid"]').type('BSEF22M700');
      cy.get('[data-testid="register-password"]').type('journeypass123');
      cy.get('[data-testid="register-confirm-password"]').type('journeypass123');
      cy.get('[data-testid="register-submit"]').click();
      cy.wait(1000);
      
      // Step 2: Login
      cy.get('[data-testid="login-email"]').type('journey@example.com');
      cy.get('[data-testid="login-password"]').type('journeypass123');
      cy.get('[data-testid="login-submit"]').click();
      cy.wait(1000);
      
      // Step 3: View Elections
      cy.get('[data-testid="elections-list"]').should('be.visible');
      cy.get('[data-testid="election-e1"]').should('be.visible');
      
      // Step 4: Cast Vote
      cy.get('[data-testid="vote-c2"]').first().click();
      cy.wait(1000);
      
      // Step 5: Verify Vote Confirmation
      cy.get('[data-testid="voted-badge"]').should('be.visible');
      
      // Step 6: View Results
      cy.get('[data-testid="tab-results"]').click();
      cy.get('[data-testid="results-page"]').should('be.visible');
      cy.contains('Total Votes:').should('be.visible');
      
      // Step 7: Logout
      cy.get('[data-testid="tab-elections"]').click();
      cy.get('[data-testid="logout-button"]').click();
      cy.get('[data-testid="login-form"]').should('be.visible');
    });
  });
});

// ============================================
// Test Configuration and Custom Commands
// ============================================

// cypress/support/commands.js
Cypress.Commands.add('registerUser', (userData) => {
  cy.get('[data-testid="tab-register"]').click();
  cy.get('[data-testid="register-fullname"]').type(userData.fullName);
  cy.get('[data-testid="register-email"]').type(userData.email);
  cy.get('[data-testid="register-studentid"]').type(userData.studentId);
  cy.get('[data-testid="register-password"]').type(userData.password);
  cy.get('[data-testid="register-confirm-password"]').type(userData.password);
  cy.get('[data-testid="register-submit"]').click();
  cy.wait(1000);
});

Cypress.Commands.add('loginUser', (email, password) => {
  cy.get('[data-testid="tab-login"]').click();
  cy.get('[data-testid="login-email"]').type(email);
  cy.get('[data-testid="login-password"]').type(password);
  cy.get('[data-testid="login-submit"]').click();
  cy.wait(1000);
});

Cypress.Commands.add('castVote', (candidateId) => {
  cy.get(`[data-testid="vote-${candidateId}"]`).first().click();
  cy.wait(1000);
});

// ============================================
// Performance Tests
// ============================================
describe('Performance Tests', () => {
  
  it('TC-027: Page should load within acceptable time', () => {
    const start = Date.now();
    cy.visit('/');
    cy.get('[data-testid="tab-login"]').should('be.visible').then(() => {
      const loadTime = Date.now() - start;
      expect(loadTime).to.be.lessThan(3000); // 3 seconds
    });
  });

  
  it('TC-028: UI should be responsive', () => {
    // 1. Force a fresh visit to be absolutely sure
    cy.visit('http://localhost:3000');
    
    // 2. Test Mobile Viewport
    cy.viewport('iphone-x');
    cy.wait(1000); // Give it a second to resize
    // We check for the Main Title instead of the button (More stable)
    cy.get('h1').should('contain', 'Secure Online Voting System');
    
    // 3. Test Tablet Viewport
    cy.viewport('ipad-2');
    cy.wait(1000);
    cy.get('h1').should('contain', 'Secure Online Voting System');
    
    // 4. Test Desktop Viewport
    cy.viewport(1920, 1080);
    cy.wait(1000);
    cy.get('h1').should('contain', 'Secure Online Voting System');
  });
});

// Test Execution Summary:
// Total Test Cases: 28
// Coverage:
// - User Registration: 6 tests
// - User Login: 4 tests
// - Voting Functionality: 4 tests
// - Results Display: 3 tests
// - UI/UX: 3 tests
// - Data Persistence: 2 tests
// - Security: 3 tests
// - Complete Journey: 1 test
// - Performance: 2 tests