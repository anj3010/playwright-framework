/**
 * Logger Utility Class
 * Provides logging functionality for the framework
 */
export class Logger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Log info message
   */
  static info(message: string, ...args: any[]): void {
    console.log(`[${this.getTimestamp()}] ℹ️  INFO: ${message}`, ...args);
  }

  /**
   * Log success message
   */
  static success(message: string, ...args: any[]): void {
    console.log(`[${this.getTimestamp()}] ✅ SUCCESS: ${message}`, ...args);
  }

  /**
   * Log warning message
   */
  static warn(message: string, ...args: any[]): void {
    console.warn(`[${this.getTimestamp()}] ⚠️  WARNING: ${message}`, ...args);
  }

  /**
   * Log error message
   */
  static error(message: string, ...args: any[]): void {
    console.error(`[${this.getTimestamp()}] ❌ ERROR: ${message}`, ...args);
  }

  /**
   * Log debug message
   */
  static debug(message: string, ...args: any[]): void {
    if (process.env.DEBUG === 'true') {
      console.log(`[${this.getTimestamp()}] 🐛 DEBUG: ${message}`, ...args);
    }
  }

  /**
   * Log test step
   */
  static step(message: string): void {
    console.log(`[${this.getTimestamp()}] 📝 STEP: ${message}`);
  }

  /**
   * Log separator
   */
  static separator(): void {
    console.log('═'.repeat(80));
  }

  /**
   * Log section header
   */
  static section(title: string): void {
    this.separator();
    console.log(`  ${title}`);
    this.separator();
  }
}

// Made with Bob
