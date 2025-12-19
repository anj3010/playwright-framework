import { APIRequestContext, request } from '@playwright/test';
import { EnvironmentConfig } from '../config/EnvironmentConfig';
import { Logger } from '../utils/Logger';

/**
 * API Client Class
 * Provides methods for making API requests
 */
export class ApiClient {
  private context: APIRequestContext | null = null;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || EnvironmentConfig.API_BASE_URL;
  }

  /**
   * Initialize API context
   */
  async init(): Promise<void> {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      timeout: EnvironmentConfig.API_TIMEOUT,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    Logger.info(`API Client initialized with base URL: ${this.baseURL}`);
  }

  /**
   * Dispose API context
   */
  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      Logger.info('API Client disposed');
    }
  }

  /**
   * GET request
   */
  async get(endpoint: string, options?: any): Promise<any> {
    if (!this.context) await this.init();
    
    Logger.step(`GET request to: ${endpoint}`);
    const response = await this.context!.get(endpoint, options);
    
    Logger.info(`Response status: ${response.status()}`);
    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body: await response.json().catch(() => response.text())
    };
  }

  /**
   * POST request
   */
  async post(endpoint: string, data?: any, options?: any): Promise<any> {
    if (!this.context) await this.init();
    
    Logger.step(`POST request to: ${endpoint}`);
    const response = await this.context!.post(endpoint, {
      data,
      ...options
    });
    
    Logger.info(`Response status: ${response.status()}`);
    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body: await response.json().catch(() => response.text())
    };
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any, options?: any): Promise<any> {
    if (!this.context) await this.init();
    
    Logger.step(`PUT request to: ${endpoint}`);
    const response = await this.context!.put(endpoint, {
      data,
      ...options
    });
    
    Logger.info(`Response status: ${response.status()}`);
    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body: await response.json().catch(() => response.text())
    };
  }

  /**
   * PATCH request
   */
  async patch(endpoint: string, data?: any, options?: any): Promise<any> {
    if (!this.context) await this.init();
    
    Logger.step(`PATCH request to: ${endpoint}`);
    const response = await this.context!.patch(endpoint, {
      data,
      ...options
    });
    
    Logger.info(`Response status: ${response.status()}`);
    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body: await response.json().catch(() => response.text())
    };
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string, options?: any): Promise<any> {
    if (!this.context) await this.init();
    
    Logger.step(`DELETE request to: ${endpoint}`);
    const response = await this.context!.delete(endpoint, options);
    
    Logger.info(`Response status: ${response.status()}`);
    return {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      body: await response.json().catch(() => response.text())
    };
  }

  /**
   * Set authentication header
   */
  async setAuthToken(token: string): Promise<void> {
    if (!this.context) await this.init();
    
    // Dispose old context and create new one with auth header
    await this.dispose();
    this.context = await request.newContext({
      baseURL: this.baseURL,
      timeout: EnvironmentConfig.API_TIMEOUT,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    Logger.info('Authentication token set');
  }

  /**
   * Set custom headers
   */
  async setHeaders(headers: Record<string, string>): Promise<void> {
    if (!this.context) await this.init();
    
    await this.dispose();
    this.context = await request.newContext({
      baseURL: this.baseURL,
      timeout: EnvironmentConfig.API_TIMEOUT,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
      }
    });
    Logger.info('Custom headers set');
  }
}

// Made with Bob
