import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Example Page Object Model
 * Demonstrates how to create page objects for your application
 */
export class ExamplePage extends BasePage {
  // Page URL
  private readonly pageUrl = 'https://example.com';

  // Locators
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly resultsContainer: Locator;
  private readonly loginButton: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.searchInput = page.locator('#search-input');
    this.searchButton = page.locator('button[type="submit"]');
    this.resultsContainer = page.locator('.results-container');
    this.loginButton = page.locator('#login-btn');
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#submit-btn');
  }

  /**
   * Navigate to the example page
   */
  async navigate(): Promise<void> {
    await this.goto(this.pageUrl);
  }

  /**
   * Perform search
   */
  async search(query: string): Promise<void> {
    await this.fill(this.searchInput, query);
    await this.click(this.searchButton);
    await this.waitForElement(this.resultsContainer);
  }

  /**
   * Login to the application
   */
  async login(username: string, password: string): Promise<void> {
    await this.click(this.loginButton);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  /**
   * Get search results count
   */
  async getResultsCount(): Promise<number> {
    const results = await this.page.locator('.result-item').count();
    return results;
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible('.user-profile');
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText('.welcome-message');
  }
}

// Made with Bob
