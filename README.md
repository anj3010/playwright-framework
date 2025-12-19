# Playwright TypeScript Automation Framework

A comprehensive automation testing framework built with Playwright and TypeScript, featuring Oracle database integration and Allure reporting capabilities.

## 🚀 Features

- ✅ **Playwright with TypeScript** - Modern, reliable end-to-end testing
- ✅ **Oracle Database Integration** - Full CRUD operations with connection pooling
- ✅ **Allure Reporting** - Beautiful, detailed test reports with screenshots and logs
- ✅ **Page Object Model** - Maintainable and reusable test components
- ✅ **API Testing** - Built-in REST API testing capabilities
- ✅ **Multi-browser Support** - Chrome, Firefox, Safari, and Edge
- ✅ **Parallel Execution** - Faster test execution
- ✅ **Environment Management** - Secure credential handling with .env files
- ✅ **Custom Fixtures** - Shared test setup and teardown
- ✅ **Comprehensive Logging** - Detailed execution logs

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Oracle Database (with connection details)
- Git

## 🛠️ Installation

### 1. Clone or navigate to the project directory

```bash
cd Code-Prac/Framwork
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npm run install:browsers
```

### 4. Configure environment variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` file with your Oracle database credentials:

```env
# Oracle Database Configuration
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_CONNECTION_STRING=localhost:1521/XEPDB1

# Test Environment
BASE_URL=https://your-app-url.com
API_BASE_URL=https://api.your-app-url.com
```

## 📁 Project Structure

```
Code-Prac/Framwork/
├── src/
│   ├── pages/              # Page Object Models
│   │   ├── BasePage.ts
│   │   └── ExamplePage.ts
│   ├── api/                # API utilities
│   │   ├── ApiClient.ts
│   │   └── ApiEndpoints.ts
│   ├── utils/              # Helper utilities
│   │   ├── DatabaseHelper.ts
│   │   ├── Logger.ts
│   │   └── TestDataHelper.ts
│   └── config/             # Configuration
│       ├── DatabaseConfig.ts
│       └── EnvironmentConfig.ts
├── tests/
│   ├── ui/                 # UI test cases
│   │   └── example.spec.ts
│   ├── api/                # API test cases
│   │   └── example.api.spec.ts
│   └── fixtures/           # Test fixtures
│       └── baseTest.ts
├── test-data/              # Test data files
├── allure-results/         # Allure test results
├── allure-report/          # Generated reports
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run tests in headed mode (see browser)

```bash
npm run test:headed
```

### Run UI tests only

```bash
npm run test:ui
```

### Run API tests only

```bash
npm run test:api
```

### Run tests in specific browser

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Debug tests

```bash
npm run test:debug
```

### View Playwright HTML report

```bash
npm run test:report
```

## 📊 Allure Reports

### Generate and open Allure report

```bash
npm run report
```

### Generate Allure report only

```bash
npm run allure:generate
```

### Open existing Allure report

```bash
npm run allure:open
```

### Serve Allure report (with live reload)

```bash
npm run allure:serve
```

## 🗄️ Database Integration

### Using Database Helper in Tests

```typescript
import { test, expect } from '../fixtures/baseTest';

test('example database test', async ({ db }) => {
  // Execute query
  const users = await db.executeQuery('SELECT * FROM users WHERE id = :1', [1]);
  
  // Insert data
  await db.insert('users', {
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // Update data
  await db.update('users', { name: 'Jane Doe' }, 'id = :1', [1]);
  
  // Delete data
  await db.delete('users', 'id = :1', [1]);
  
  // Check if record exists
  const exists = await db.exists('users', 'email = :1', ['john@example.com']);
  
  // Execute transaction
  await db.executeTransaction([
    { query: 'INSERT INTO orders (user_id) VALUES (:1)', binds: [1] },
    { query: 'UPDATE users SET order_count = order_count + 1 WHERE id = :1', binds: [1] }
  ]);
});
```

## 🌐 API Testing

### Using API Client in Tests

```typescript
import { test, expect } from '../fixtures/baseTest';
import { ApiEndpoints } from '../../src/api/ApiEndpoints';

test('example API test', async ({ api }) => {
  // GET request
  const response = await api.get(ApiEndpoints.USERS.GET_ALL);
  expect(response.status).toBe(200);
  
  // POST request
  const createResponse = await api.post(ApiEndpoints.USERS.CREATE, {
    name: 'John Doe',
    email: 'john@example.com'
  });
  expect(createResponse.status).toBe(201);
  
  // PUT request
  await api.put(ApiEndpoints.USERS.UPDATE(1), { name: 'Jane Doe' });
  
  // DELETE request
  await api.delete(ApiEndpoints.USERS.DELETE(1));
  
  // Set authentication token
  await api.setAuthToken('your-token-here');
});
```

## 📝 Writing Tests

### UI Test Example

```typescript
import { test, expect } from '../fixtures/baseTest';
import { ExamplePage } from '../../src/pages/ExamplePage';

test('example UI test', async ({ page, db }) => {
  const examplePage = new ExamplePage(page);
  
  // Navigate to page
  await examplePage.navigate();
  
  // Perform actions
  await examplePage.login('username', 'password');
  
  // Verify in database
  const user = await db.getOne('SELECT * FROM users WHERE username = :1', ['username']);
  expect(user).toBeDefined();
});
```

### API Test Example

```typescript
import { test, expect } from '../fixtures/baseTest';
import { ApiEndpoints } from '../../src/api/ApiEndpoints';

test('example API test', async ({ api, db }) => {
  // Create via API
  const response = await api.post(ApiEndpoints.USERS.CREATE, {
    name: 'Test User',
    email: 'test@example.com'
  });
  
  // Verify in database
  const user = await db.getOne('SELECT * FROM users WHERE email = :1', ['test@example.com']);
  expect(user.name).toBe('Test User');
});
```

## 🎯 Best Practices

1. **Use Page Object Model** - Keep page logic separate from tests
2. **Use Fixtures** - Share common setup/teardown logic
3. **Database Cleanup** - Always clean up test data after tests
4. **Meaningful Test Names** - Use descriptive test names
5. **Independent Tests** - Tests should not depend on each other
6. **Use Logger** - Log important steps for debugging
7. **Environment Variables** - Never commit credentials
8. **Assertions** - Use appropriate assertions for better error messages

## 🔧 Configuration

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test timeout
- Retry attempts
- Parallel execution
- Browser options
- Screenshot/video settings

### Environment Configuration

Edit `.env` file to configure:
- Database credentials
- Base URLs
- API endpoints
- Browser settings
- Timeouts

## 🐛 Debugging

### Debug in VS Code

1. Set breakpoints in your test
2. Run: `npm run test:debug`
3. Use Playwright Inspector to step through tests

### View Test Traces

Traces are automatically captured on test failure. View them in the Playwright HTML report.

### Database Debugging

Enable debug logging by setting in `.env`:
```env
DEBUG=true
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [Oracle Node.js Driver Documentation](https://oracle.github.io/node-oracledb/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

ISC

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Happy Testing! 🚀**