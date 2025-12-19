import oracledb from 'oracledb';
import { EnvironmentConfig } from './EnvironmentConfig';

/**
 * Database Configuration Class
 * Manages Oracle database connection pool and provides connection utilities
 */
export class DatabaseConfig {
  private static pool: oracledb.Pool | null = null;

  /**
   * Initialize the database connection pool
   */
  static async initializePool(): Promise<void> {
    try {
      if (this.pool) {
        console.log('✅ Database pool already initialized');
        return;
      }

      const config = EnvironmentConfig.getDatabaseConfig();
      
      // Create connection pool
      this.pool = await oracledb.createPool({
        user: config.user,
        password: config.password,
        connectString: config.connectString,
        poolMin: config.poolMin,
        poolMax: config.poolMax,
        poolIncrement: config.poolIncrement,
        poolTimeout: 60, // Close idle connections after 60 seconds
        enableStatistics: true
      });

      console.log('✅ Oracle Database connection pool initialized successfully');
      console.log(`   Pool Size: ${config.poolMin} - ${config.poolMax}`);
      console.log(`   Connection String: ${config.connectString}`);
    } catch (error) {
      console.error('❌ Failed to initialize database pool:', error);
      throw error;
    }
  }

  /**
   * Get a connection from the pool
   */
  static async getConnection(): Promise<oracledb.Connection> {
    try {
      if (!this.pool) {
        await this.initializePool();
      }
      
      const connection = await this.pool!.getConnection();
      return connection;
    } catch (error) {
      console.error('❌ Failed to get database connection:', error);
      throw error;
    }
  }

  /**
   * Close the connection pool
   */
  static async closePool(): Promise<void> {
    try {
      if (this.pool) {
        await this.pool.close(10); // Wait 10 seconds for connections to close
        this.pool = null;
        console.log('✅ Database pool closed successfully');
      }
    } catch (error) {
      console.error('❌ Failed to close database pool:', error);
      throw error;
    }
  }

  /**
   * Get pool statistics
   */
  static getPoolStatistics(): oracledb.PoolStatistics | null {
    if (this.pool) {
      return this.pool.getStatistics();
    }
    return null;
  }

  /**
   * Check if pool is initialized
   */
  static isPoolInitialized(): boolean {
    return this.pool !== null;
  }
}

// Made with Bob
