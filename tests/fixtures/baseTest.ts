import { test as base } from '@playwright/test';
import { DatabaseConfig } from '../../src/config/DatabaseConfig';
import { DatabaseHelper } from '../../src/utils/DatabaseHelper';
import { ApiClient } from '../../src/api/ApiClient';
import { Logger } from '../../src/utils/Logger';

/**
 * Extended test fixtures with database and API support
 */
type TestFixtures = {
  db: typeof DatabaseHelper;
  api: ApiClient;
};

/**
 * Base test with custom fixtures
 * Provides database and API client to all tests
 */
export const test = base.extend<TestFixtures>({
  /**
   * Database fixture
   * Initializes database connection pool before tests
   */
  db: async ({}, use) => {
    Logger.section('Database Setup');
    await DatabaseConfig.initializePool();
    
    await use(DatabaseHelper);
    
    Logger.section('Database Teardown');
    await DatabaseConfig.closePool();
  },

  /**
   * API client fixture
   * Provides initialized API client for tests
   */
  api: async ({}, use) => {
    Logger.section('API Client Setup');
    const apiClient = new ApiClient();
    await apiClient.init();
    
    await use(apiClient);
    
    Logger.section('API Client Teardown');
    await apiClient.dispose();
  }
});

export { expect } from '@playwright/test';

// Made with Bob
