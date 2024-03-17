import { ConnectionPool, VarChar, Int } from 'mssql';
import moment from 'moment';

import { SecureVersion } from "tls";
import { Database } from "../models/database.model";
import { BaseRecord, CheckDuplicateParams, } from '../types';

export async function getConfigByDbId(dbId: string) {
    const foundedDb = await Database.findById(dbId).exec();

    if (!foundedDb || !foundedDb._id) {
      throw new Error(`db ${dbId} does not exists`);
    }

    const config = {
      user: foundedDb.username,
      password: foundedDb.password,
      server: foundedDb.address,
      database: foundedDb.name,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 60000
      },
      options: {
        encrypt: false, // for azure
        trustServerCertificate: false, // change to true for local dev / self-signed certs
        enableArithAbort: true,
        cryptoCredentialsDetails: {
          minVersion: 'TLSv1.3' as SecureVersion,
        },
      },
    };

    return config
}

export const checkForDuplicateRecord = async (params: CheckDuplicateParams) => {
    let pool;
  
    try {
      const { tplk, netT, kaCode, ghErtebat, dbId } = params;
  
      const config = await getConfigByDbId(dbId);
      pool = new ConnectionPool(config);
      await pool.connect();
  
      // Prepare the SQL command for checking duplicates
      const checkDuplicateSql = `
        SELECT COUNT(code) AS count
        FROM salbarno 
        WHERE carno = @tplk 
          AND weight = @netT 
          AND code = @kaCode 
          AND hamlcode = @ghErtebat 
          AND LEN(carno) > 3
      `;
  
      // Create a request for executing the SQL command
      const request = pool.request();
      request.input('tplk', VarChar, tplk);
      request.input('netT', Int, netT);
      request.input('kaCode', VarChar, kaCode);
      request.input('ghErtebat', VarChar, ghErtebat);
  
      // Execute the query
      const result = await request.query(checkDuplicateSql);
      const isDuplicate = result.recordset[0].count > 0;
  
      // Return whether it is a duplicate
      return isDuplicate;
    } catch (error) {
      console.error('Error checking for duplicate record:', error);
      throw error;
    } finally {
      // Ensure the connection pool is closed
      if (pool) await pool.close();
    }
  };

  export const insertRecord = async (params: BaseRecord, dbId: string): Promise<void> => {
    let pool: ConnectionPool | undefined;
  
    try {
      const config = await getConfigByDbId(dbId);
      pool = new ConnectionPool(config);
      await pool.connect();
  
      const request = pool.request();
      const datedo = moment().locale('fa').format('YY/MM/DD');
  
      request.input('tplk', VarChar, params.tplk);
      request.input('weight', Int, params.netT);
      request.input('code', VarChar, params.kaCode);
      request.input('hamlcode', VarChar, params.ghErtebat);
      request.input('serial', VarChar, params.bar_n_s);
      request.input('barno', Int, params.bar_n);
      request.input('tarekh', VarChar, params.barDate);
      request.input('tel', VarChar, params.dTel);
      request.input('datedo', VarChar, datedo);
      request.input('accdo', Int, 0);
      request.input('FacRecno', Int, 1);
      request.input('FacNeed', Int, 0);
      request.input('notification', Int, 0);
      request.input('send', Int, 0);
      request.input('LockDate', VarChar, null);
      request.input('lock', Int, 0);
  
      const sqlCommand = `
          INSERT INTO salbarno (carno, weight, code, hamlcode, serial, barno, tarekh, tel, datedo, accdo, FacRecno, FacNeed, notification, send, LockDate, lock)
          VALUES (@tplk, @weight, @code, @hamlcode, @serial, @barno, @tarekh, @tel, @datedo, @accdo, @FacRecno, @FacNeed, @notification, @send, @LockDate, @lock)
      `;
  
      await request.query(sqlCommand);
    } catch (error) {
      console.error('Error inserting record:', error);
      throw error;
    } finally {
      if (pool) await pool.close();
    }
  };
  