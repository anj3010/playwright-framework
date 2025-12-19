# Setup Guide - Playwright TypeScript Automation Framework

This guide will help you set up and configure the automation framework with Oracle database integration.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18 or higher installed
- [ ] npm (comes with Node.js)
- [ ] Oracle Database access (credentials and connection string)
- [ ] Git (optional, for version control)
- [ ] Code editor (VS Code recommended)

## 🚀 Step-by-Step Setup

### Step 1: Verify Node.js Installation

```bash
node --version
npm --version
```

Expected output: Node.js v18.x.x or higher

### Step 2: Navigate to Project Directory

```bash
cd Code-Prac/Framwork
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- Playwright
- TypeScript
- Oracle database driver (oracledb)
- Allure reporter
- All other dependencies

### Step 4: Install Playwright Browsers

```bash
npm run install:browsers
```

This downloads Chromium, Firefox, and WebKit browsers.

### Step 5: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your actual credentials:

```env
# Oracle Database Configuration
DB_USER=your_actual_username
DB_PASSWORD=your_actual_password
DB_CONNECTION_STRING=hostname:port/service_name
# Example: localhost:1521/XEPDB1 or mydb.example.com:1521/PROD

# Database Pool Configuration (optional, defaults are fine)
DB_POOL_MIN=1
DB_POOL_MAX=10
DB_POOL_INCREMENT=1

# Test Environment
TEST_ENV=dev
BASE_URL=https://your-application-url.com
# Example: https://example.com or http://localhost:3000

# API Configuration
API_BASE_URL=https://your-api-url.com
# Example: https://api.example.com or http://localhost:8080/api
API_TIMEOUT=30000

# Test Configuration
HEADLESS=true
BROWSER=chromium
SLOW_MO=0
TIMEOUT=30000
```

### Step 6: Verify Oracle Database Connection

The framework will automatically validate your database connection when you run tests. To test it manually, you can create a simple test:

```typescript
// tests/verify-db.spec.ts
import { test } from './fixtures/baseTest';

test('verify database connection', async ({ db }) => {
  const result = await db.executeQuery('SELECT 1 FROM DUAL');
  console.log('Database connection successful!', result);
});
```

Run it:
```bash
npx playwright test tests/verify-db.spec.ts
```

### Step 7: Run Example Tests

```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm run test:headed

# Run specific test file
npx playwright test tests/ui/example.spec.ts
```

### Step 8: Generate Allure Report

After running tests:

```bash
npm run report
```

This will generate and open the Allure report in your browser.

## 🔧 Oracle Database Setup

### Connection String Formats

The Oracle connection string can be in different formats:

1. **Easy Connect Format** (recommended):
   ```
   hostname:port/service_name
   ```
   Example: `localhost:1521/XEPDB1`

2. **Easy Connect Plus Format**:
   ```
   hostname:port/service_name?parameter=value
   ```
   Example: `mydb.example.com:1521/PROD?poolMin=4&poolMax=20`

3. **TNS Alias** (if you have tnsnames.ora configured):
   ```
   TNS_ALIAS_NAME
   ```
   Example: `MYDB_PROD`

### Testing Database Connection

You can test your Oracle database connection using SQL*Plus or SQL Developer before configuring the framework:

```bash
sqlplus username/password@hostname:port/service_name
```

### Common Database Issues

**Issue**: `ORA-12154: TNS:could not resolve the connect identifier`
- **Solution**: Check your connection string format
- Verify hostname, port, and service name are correct

**Issue**: `ORA-01017: invalid username/password`
- **Solution**: Verify credentials in `.env` file
- Ensure no extra spaces in username/password

**Issue**: `ORA-12541: TNS:no listener`
- **Solution**: Verify Oracle listener is running
- Check if port 1521 (or your custom port) is accessible

**Issue**: Connection pool errors
- **Solution**: Adjust pool settings in `.env`:
  ```env
  DB_POOL_MIN=1
  DB_POOL_MAX=5
  ```

## 📝 Creating Your First Test

### 1. Create a Page Object

```typescript
// src/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
```

### 2. Create a Test

```typescript
// tests/ui/login.spec.ts
import { test, expect } from '../fixtures/baseTest';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Login Tests', () => {
  test('should login successfully and verify in database', async ({ page, db }) => {
    const loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.goto('https://your-app.com/login');
    
    // Perform login
    await loginPage.login('testuser', 'password123');
    
    // Verify in database
    const session = await db.getOne(
      'SELECT * FROM user_sessions WHERE username = :1 AND active = 1',
      ['testuser']
    );
    
    expect(session).toBeDefined();
    expect(session.USERNAME).toBe('testuser');
  });
});
```

### 3. Run Your Test

```bash
npx playwright test tests/ui/login.spec.ts
```

## 🎯 Next Steps

1. **Customize Page Objects**: Create page objects for your application
2. **Add Test Data**: Create test data files in `test-data/` directory
3. **Configure CI/CD**: Set up continuous integration
4. **Add More Tests**: Expand test coverage
5. **Customize Reports**: Modify Allure report categories

## 📚 Useful Commands

```bash
# Run tests
npm test                          # All tests
npm run test:ui                   # UI tests only
npm run test:api                  # API tests only
npm run test:chrome               # Chrome only
npm run test:headed               # See browser
npm run test:debug                # Debug mode

# Reports
npm run test:report               # Playwright report
npm run report                    # Allure report
npm run allure:serve              # Serve Allure with live reload

# Maintenance
npm run clean                     # Clean reports
npm run install:browsers          # Reinstall browsers
```

## 🐛 Troubleshooting

### Tests Not Running

1. Check if all dependencies are installed:
   ```bash
   npm install
   ```

2. Verify Playwright browsers are installed:
   ```bash
   npm run install:browsers
   ```

3. Check `.env` file exists and has correct values

### Database Connection Issues

1. Test connection string with SQL*Plus or SQL Developer
2. Verify firewall/network allows connection to database
3. Check if Oracle listener is running
4. Verify credentials are correct

### Allure Report Not Generating

1. Ensure tests have run at least once:
   ```bash
   npm test
   ```

2. Check if `allure-results` directory exists and has files

3. Regenerate report:
   ```bash
   npm run allure:generate
   ```

### TypeScript Compilation Errors

1. Check `tsconfig.json` is present
2. Verify TypeScript is installed:
   ```bash
   npm install -D typescript
   ```

3. Clean and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 💡 Tips

1. **Use VS Code Extensions**:
   - Playwright Test for VS Code
   - Oracle Developer Tools for VS Code
   - ESLint
   - Prettier

2. **Database Best Practices**:
   - Always clean up test data after tests
   - Use transactions for data setup
   - Create dedicated test database/schema
   - Never use production database for testing

3. **Test Organization**:
   - Group related tests in describe blocks
   - Use meaningful test names
   - Keep tests independent
   - Use fixtures for common setup

4. **Performance**:
   - Run tests in parallel when possible
   - Use connection pooling (already configured)
   - Clean up resources properly
   - Use appropriate timeouts

## 📞 Getting Help

If you encounter issues:

1. Check this guide and README.md
2. Review error messages carefully
3. Check Playwright documentation: https://playwright.dev/
4. Check Oracle Node.js driver docs: https://oracle.github.io/node-oracledb/
5. Create an issue in the repository

---

**You're all set! Happy Testing! 🚀**