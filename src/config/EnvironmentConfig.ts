import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment Configuration Class
 * Manages all environment variables and configuration settings
 */
export class EnvironmentConfig {
  // Database Configuration
  static readonly DB_USER = process.env.DB_USER || '';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || '';
  static readonly DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || '';
  static readonly DB_POOL_MIN = parseInt(process.env.DB_POOL_MIN || '1');
  static readonly DB_POOL_MAX = parseInt(process.env.DB_POOL_MAX || '10');
  static readonly DB_POOL_INCREMENT = parseInt(process.env.DB_POOL_INCREMENT || '1');

  // Test Environment
  static readonly TEST_ENV = process.env.TEST_ENV || 'dev';
  static readonly BASE_URL = process.env.BASE_URL || 'https://example.com';

  // API Configuration
  static readonly API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';
  static readonly API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000');

  // Browser Configuration
  static readonly HEADLESS = process.env.HEADLESS === 'true';
  static readonly BROWSER = process.env.BROWSER || 'chromium';
  static readonly SLOW_MO = parseInt(process.env.SLOW_MO || '0');
  static readonly TIMEOUT = parseInt(process.env.TIMEOUT || '30000');

  // Allure Configuration
  static readonly ALLURE_RESULTS_DIR = process.env.ALLURE_RESULTS_DIR || 'allure-results';
  static readonly ALLURE_REPORT_DIR = process.env.ALLURE_REPORT_DIR || 'allure-report';

  /**
   * Validate that all required environment variables are set
   */
  static validateConfig(): void {
    const requiredVars = [
      'DB_USER',
      'DB_PASSWORD',
      'DB_CONNECTION_STRING'
    ];

    const missingVars = requiredVars.filter(varName => {
      const value = process.env[varName];
      return !value || value.trim() === '';
    });

    if (missingVars.length > 0) {
      console.warn(`⚠️  Warning: Missing environment variables: ${missingVars.join(', ')}`);
      console.warn('Please copy .env.example to .env and fill in the required values.');
    }
  }

  /**
   * Get database configuration object
   */
  static getDatabaseConfig() {
    return {
      user: this.DB_USER,
      password: this.DB_PASSWORD,
      connectString: this.DB_CONNECTION_STRING,
      poolMin: this.DB_POOL_MIN,
      poolMax: this.DB_POOL_MAX,
      poolIncrement: this.DB_POOL_INCREMENT
    };
  }

  /**
   * Print current configuration (without sensitive data)
   */
  static printConfig(): void {
    console.log('\n📋 Current Configuration:');
    console.log(`   Environment: ${this.TEST_ENV}`);
    console.log(`   Base URL: ${this.BASE_URL}`);
    console.log(`   API Base URL: ${this.API_BASE_URL}`);
    console.log(`   Browser: ${this.BROWSER}`);
    console.log(`   Headless: ${this.HEADLESS}`);
    console.log(`   Database: ${this.DB_CONNECTION_STRING}`);
    console.log(`   Database User: ${this.DB_USER ? '***' : 'Not Set'}`);
    console.log('');
  }
}

// Validate configuration on module load
EnvironmentConfig.validateConfig();

// Made with Bob
