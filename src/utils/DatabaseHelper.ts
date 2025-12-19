import oracledb from 'oracledb';
import { DatabaseConfig } from '../config/DatabaseConfig';

/**
 * Database Helper Class
 * Provides utility methods for database operations
 */
export class DatabaseHelper {
  /**
   * Execute a SELECT query and return results
   */
  static async executeQuery<T = any>(
    query: string,
    binds: any[] = [],
    options: oracledb.ExecuteOptions = {}
  ): Promise<T[]> {
    let connection: oracledb.Connection | null = null;
    
    try {
      connection = await DatabaseConfig.getConnection();
      
      const result = await connection.execute(query, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        ...options
      });

      console.log(`✅ Query executed successfully. Rows returned: ${result.rows?.length || 0}`);
      return (result.rows as T[]) || [];
    } catch (error) {
      console.error('❌ Query execution failed:', error);
      console.error('Query:', query);
      console.error('Binds:', binds);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }

  /**
   * Execute an INSERT, UPDATE, or DELETE query
   */
  static async executeNonQuery(
    query: string,
    binds: any[] = [],
    autoCommit: boolean = true
  ): Promise<number> {
    let connection: oracledb.Connection | null = null;
    
    try {
      connection = await DatabaseConfig.getConnection();
      
      const result = await connection.execute(query, binds, {
        autoCommit: autoCommit
      });

      const rowsAffected = result.rowsAffected || 0;
      console.log(`✅ Non-query executed successfully. Rows affected: ${rowsAffected}`);
      return rowsAffected;
    } catch (error) {
      console.error('❌ Non-query execution failed:', error);
      console.error('Query:', query);
      console.error('Binds:', binds);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  static async executeTransaction(
    queries: Array<{ query: string; binds?: any[] }>
  ): Promise<void> {
    let connection: oracledb.Connection | null = null;
    
    try {
      connection = await DatabaseConfig.getConnection();
      
      for (const { query, binds = [] } of queries) {
        await connection.execute(query, binds, { autoCommit: false });
      }
      
      await connection.commit();
      console.log(`✅ Transaction completed successfully. ${queries.length} queries executed.`);
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
          console.log('⚠️  Transaction rolled back due to error');
        } catch (rollbackErr) {
          console.error('Error during rollback:', rollbackErr);
        }
      }
      console.error('❌ Transaction failed:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }

  /**
   * Execute a stored procedure
   */
  static async executeProcedure(
    procedureName: string,
    binds: any = {},
    options: oracledb.ExecuteOptions = {}
  ): Promise<any> {
    let connection: oracledb.Connection | null = null;
    
    try {
      connection = await DatabaseConfig.getConnection();
      
      const result = await connection.execute(
        `BEGIN ${procedureName}; END;`,
        binds,
        options
      );

      console.log(`✅ Procedure ${procedureName} executed successfully`);
      return result;
    } catch (error) {
      console.error(`❌ Procedure ${procedureName} execution failed:`, error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }

  /**
   * Get a single row from a query
   */
  static async getOne<T = any>(
    query: string,
    binds: any[] = []
  ): Promise<T | null> {
    const results = await this.executeQuery<T>(query, binds);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Check if a record exists
   */
  static async exists(
    tableName: string,
    whereClause: string,
    binds: any[] = []
  ): Promise<boolean> {
    const query = `SELECT COUNT(*) as count FROM ${tableName} WHERE ${whereClause}`;
    const result = await this.getOne<{ COUNT: number }>(query, binds);
    return result ? result.COUNT > 0 : false;
  }

  /**
   * Insert a record and return the inserted ID (if applicable)
   */
  static async insert(
    tableName: string,
    data: Record<string, any>,
    returningColumn?: string
  ): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `:${i + 1}`).join(', ');
    
    let query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    if (returningColumn) {
      query += ` RETURNING ${returningColumn} INTO :returning`;
      values.push({ dir: oracledb.BIND_OUT, type: oracledb.NUMBER });
    }

    let connection: oracledb.Connection | null = null;
    
    try {
      connection = await DatabaseConfig.getConnection();
      
      const result = await connection.execute(query, values, { autoCommit: true });
      
      console.log(`✅ Record inserted into ${tableName}`);
      
      if (returningColumn && result.outBinds) {
        return result.outBinds.returning;
      }
      
      return result.rowsAffected;
    } catch (error) {
      console.error(`❌ Insert into ${tableName} failed:`, error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }

  /**
   * Update records
   */
  static async update(
    tableName: string,
    data: Record<string, any>,
    whereClause: string,
    whereBinds: any[] = []
  ): Promise<number> {
    const setClauses = Object.keys(data).map((key, i) => `${key} = :${i + 1}`);
    const values = [...Object.values(data), ...whereBinds];
    
    const query = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE ${whereClause}`;
    
    return await this.executeNonQuery(query, values);
  }

  /**
   * Delete records
   */
  static async delete(
    tableName: string,
    whereClause: string,
    binds: any[] = []
  ): Promise<number> {
    const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    return await this.executeNonQuery(query, binds);
  }

  /**
   * Truncate a table
   */
  static async truncate(tableName: string): Promise<void> {
    const query = `TRUNCATE TABLE ${tableName}`;
    await this.executeNonQuery(query);
    console.log(`✅ Table ${tableName} truncated`);
  }

  /**
   * Get table row count
   */
  static async getRowCount(tableName: string): Promise<number> {
    const result = await this.getOne<{ COUNT: number }>(
      `SELECT COUNT(*) as count FROM ${tableName}`
    );
    return result ? result.COUNT : 0;
  }
}

// Made with Bob
