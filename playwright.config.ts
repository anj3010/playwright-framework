import { defineConfig, devices } from '@playwright/test';
import { EnvironmentConfig } from './src/config/EnvironmentConfig';

/**
 * Playwright Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  
  /* Maximum time one test can run for */
  timeout: EnvironmentConfig.TIMEOUT,
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright', {
      outputFolder: EnvironmentConfig.ALLURE_RESULTS_DIR,
      detail: true,
      suiteTitle: true,
      categories: [
        {
          name: 'Database Tests',
          matchedStatuses: ['failed', 'broken']
        },
        {
          name: 'API Tests',
          matchedStatuses: ['failed', 'broken']
        },
        {
          name: 'UI Tests',
          matchedStatuses: ['failed', 'broken']
        }
      ],
      environmentInfo: {
        'Test Environment': EnvironmentConfig.TEST_ENV,
        'Base URL': EnvironmentConfig.BASE_URL,
        'API Base URL': EnvironmentConfig.API_BASE_URL,
        'Browser': EnvironmentConfig.BROWSER,
        'Node Version': process.version
      }
    }]
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: EnvironmentConfig.BASE_URL,
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Action timeout */
    actionTimeout: 15000,
    
    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: EnvironmentConfig.HEADLESS,
        launchOptions: {
          slowMo: EnvironmentConfig.SLOW_MO
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: EnvironmentConfig.HEADLESS,
        launchOptions: {
          slowMo: EnvironmentConfig.SLOW_MO
        }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: EnvironmentConfig.HEADLESS,
        launchOptions: {
          slowMo: EnvironmentConfig.SLOW_MO
        }
      },
    },

    /* Test against mobile viewports */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

// Made with Bob
