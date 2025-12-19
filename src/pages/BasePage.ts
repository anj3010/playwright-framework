import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/Logger';

/**
 * Base Page Class
 * Provides common page object functionality for all pages
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string): Promise<void> {
    Logger.step(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click on an element
   */
  async click(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Logger.step(`Clicking element: ${element}`);
    await element.click();
  }

  /**
   * Fill input field
   */
  async fill(locator: Locator | string, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Logger.step(`Filling element with text: ${text}`);
    await element.fill(text);
  }

  /**
   * Get text from element
   */
  async getText(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.textContent() || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator | string, timeout: number = 30000): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: 'visible', timeout });
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    Logger.step(`Taking screenshot: ${name}`);
    return await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Execute JavaScript
   */
  async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Select dropdown option by value
   */
  async selectOption(locator: Locator | string, value: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Logger.step(`Selecting option: ${value}`);
    await element.selectOption(value);
  }

  /**
   * Check checkbox
   */
  async check(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.check();
  }

  /**
   * Uncheck checkbox
   */
  async uncheck(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.uncheck();
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for specified time
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    Logger.step('Reloading page');
    await this.page.reload();
  }

  /**
   * Go back
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }
}

// Made with Bob
