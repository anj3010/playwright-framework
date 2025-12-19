/**
 * API Endpoints Configuration
 * Centralized location for all API endpoints
 */
export class ApiEndpoints {
  // User endpoints
  static readonly USERS = {
    GET_ALL: '/users',
    GET_BY_ID: (id: number) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    SEARCH: '/users/search'
  };

  // Authentication endpoints
  static readonly AUTH = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  };

  // Product endpoints
  static readonly PRODUCTS = {
    GET_ALL: '/products',
    GET_BY_ID: (id: number) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: number) => `/products/${id}`,
    DELETE: (id: number) => `/products/${id}`,
    SEARCH: '/products/search',
    BY_CATEGORY: (category: string) => `/products/category/${category}`
  };

  // Order endpoints
  static readonly ORDERS = {
    GET_ALL: '/orders',
    GET_BY_ID: (id: number) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: number) => `/orders/${id}`,
    DELETE: (id: number) => `/orders/${id}`,
    BY_USER: (userId: number) => `/orders/user/${userId}`,
    BY_STATUS: (status: string) => `/orders/status/${status}`
  };

  // Health check
  static readonly HEALTH = {
    CHECK: '/health',
    STATUS: '/health/status'
  };
}

// Made with Bob
