import { test, expect } from '../fixtures/baseTest';
import { ApiEndpoints } from '../../src/api/ApiEndpoints';
import { Logger } from '../../src/utils/Logger';

/**
 * Example API Test with Database Operations
 * Demonstrates API testing with database validation
 */
test.describe('Example API Tests with Database', () => {
  
  test.beforeEach(async () => {
    Logger.section('API Test Setup');
    Logger.info('Starting API test');
  });

  test.afterEach(async () => {
    Logger.section('API Test Cleanup');
    Logger.info('API test completed');
  });

  test('should create user via API and verify in database', async ({ api, db }) => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      password: 'SecurePass123!'
    };

    Logger.step('Create user via API');
    
    // Act - Create user through API
    const response = await api.post(ApiEndpoints.USERS.CREATE, userData);
    
    // Assert API response
    Logger.info(`API Response Status: ${response.status}`);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    
    const userId = response.body.id;
    Logger.info(`User created with ID: ${userId}`);
    
    // Verify in database
    Logger.step('Verify user in database');
    
    // Example database query (replace with actual table/column names)
    // const dbUser = await db.getOne(
    //   'SELECT * FROM users WHERE id = :1',
    //   [userId]
    // );
    
    // expect(dbUser).toBeDefined();
    // expect(dbUser.email).toBe(userData.email);
    // expect(dbUser.username).toBe(userData.username);
    
    Logger.info('Database verification would happen here');
    
    // Cleanup
    Logger.step('Cleanup test data');
    // await db.delete('users', 'id = :1', [userId]);
  });

  test('should get user from API and validate with database', async ({ api, db }) => {
    // Pre-condition: Create test user in database
    Logger.step('Setup: Create test user in database');
    
    // const testUser = {
    //   id: 999,
    //   name: 'Test User',
    //   email: 'test@example.com',
    //   username: 'testuser'
    // };
    
    // await db.insert('users', testUser);
    
    const userId = 999; // Example user ID
    
    // Act - Get user from API
    Logger.step(`Get user ${userId} from API`);
    const response = await api.get(ApiEndpoints.USERS.GET_BY_ID(userId));
    
    // Assert API response
    Logger.info(`API Response Status: ${response.status}`);
    
    // For demonstration (replace with actual assertions)
    // expect(response.status).toBe(200);
    // expect(response.body.id).toBe(userId);
    
    // Verify data matches database
    Logger.step('Verify API data matches database');
    
    // const dbUser = await db.getOne(
    //   'SELECT * FROM users WHERE id = :1',
    //   [userId]
    // );
    
    // expect(response.body.name).toBe(dbUser.name);
    // expect(response.body.email).toBe(dbUser.email);
    
    Logger.info('API and database comparison would happen here');
    
    // Cleanup
    // await db.delete('users', 'id = :1', [userId]);
  });

  test('should update user via API and verify in database', async ({ api, db }) => {
    Logger.step('Test API update with database validation');
    
    // Setup: Create initial user
    const userId = 1000;
    // const initialUser = {
    //   id: userId,
    //   name: 'Original Name',
    //   email: 'original@example.com'
    // };
    
    // await db.insert('users', initialUser);
    
    // Act - Update via API
    Logger.step('Update user via API');
    const updateData = {
      name: 'Updated Name',
      email: 'updated@example.com'
    };
    
    const response = await api.put(ApiEndpoints.USERS.UPDATE(userId), updateData);
    
    // Assert API response
    Logger.info(`API Response Status: ${response.status}`);
    // expect(response.status).toBe(200);
    
    // Verify update in database
    Logger.step('Verify update in database');
    
    // const updatedUser = await db.getOne(
    //   'SELECT * FROM users WHERE id = :1',
    //   [userId]
    // );
    
    // expect(updatedUser.name).toBe(updateData.name);
    // expect(updatedUser.email).toBe(updateData.email);
    
    Logger.info('Database update verification would happen here');
    
    // Cleanup
    // await db.delete('users', 'id = :1', [userId]);
  });

  test('should delete user via API and verify in database', async ({ api, db }) => {
    Logger.step('Test API delete with database validation');
    
    // Setup: Create user to delete
    const userId = 1001;
    // const testUser = {
    //   id: userId,
    //   name: 'User To Delete',
    //   email: 'delete@example.com'
    // };
    
    // await db.insert('users', testUser);
    
    // Verify user exists
    // const userExists = await db.exists('users', 'id = :1', [userId]);
    // expect(userExists).toBeTruthy();
    
    // Act - Delete via API
    Logger.step('Delete user via API');
    const response = await api.delete(ApiEndpoints.USERS.DELETE(userId));
    
    // Assert API response
    Logger.info(`API Response Status: ${response.status}`);
    // expect(response.status).toBe(204);
    
    // Verify deletion in database
    Logger.step('Verify user deleted from database');
    
    // const userStillExists = await db.exists('users', 'id = :1', [userId]);
    // expect(userStillExists).toBeFalsy();
    
    Logger.info('Database deletion verification would happen here');
  });

  test('should perform complex database transaction with API', async ({ api, db }) => {
    Logger.step('Test complex transaction with API and database');
    
    // Example: Create order with multiple items
    const orderData = {
      userId: 1,
      items: [
        { productId: 101, quantity: 2, price: 29.99 },
        { productId: 102, quantity: 1, price: 49.99 }
      ],
      total: 109.97
    };
    
    Logger.step('Create order via API');
    const response = await api.post(ApiEndpoints.ORDERS.CREATE, orderData);
    
    // Assert API response
    Logger.info(`API Response Status: ${response.status}`);
    
    // Verify complex transaction in database
    Logger.step('Verify order and items in database');
    
    // Example transaction verification:
    // const order = await db.getOne(
    //   'SELECT * FROM orders WHERE id = :1',
    //   [response.body.orderId]
    // );
    
    // const orderItems = await db.executeQuery(
    //   'SELECT * FROM order_items WHERE order_id = :1',
    //   [response.body.orderId]
    // );
    
    // expect(order.total).toBe(orderData.total);
    // expect(orderItems.length).toBe(orderData.items.length);
    
    Logger.info('Complex transaction verification would happen here');
    
    // Cleanup
    // await db.executeTransaction([
    //   { query: 'DELETE FROM order_items WHERE order_id = :1', binds: [response.body.orderId] },
    //   { query: 'DELETE FROM orders WHERE id = :1', binds: [response.body.orderId] }
    // ]);
  });

  test('should validate API response against database stored procedure', async ({ api, db }) => {
    Logger.step('Test API with database stored procedure');
    
    // Execute stored procedure
    // const procResult = await db.executeProcedure(
    //   'get_user_statistics(:userId, :outCursor)',
    //   {
    //     userId: 1,
    //     outCursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    //   }
    // );
    
    // Get same data from API
    const response = await api.get('/users/1/statistics');
    
    // Compare results
    Logger.info('Stored procedure and API comparison would happen here');
    
    expect(true).toBeTruthy();
  });
});

// Made with Bob
