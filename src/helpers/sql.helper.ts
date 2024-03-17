import { ConnectionPool, VarChar, Int } from 'mssql';
import moment from 'moment';

import { SecureVersion } from "tls";
import { Database } from "../models/database.model";
import { BaseRecord, CheckDuplicateParams, GetMaxSerialParams, } from '../types';

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

export const getMaxSerial = async (params: GetMaxSerialParams) => {
  let pool;

  try {
    const { kaCode, ghErtebat, dbId } = params;

    const config = await getConfigByDbId(dbId);
    pool = new ConnectionPool(config);
    await pool.connect();

    const getMaxSerialSql = `
        SELECT MAX(serial) AS maxSerial
        FROM salbarno
        WHERE hamlcode = @ghErtebat
          AND code = @kaCode
      `;

    const request = pool.request();
    request.input('ghErtebat', VarChar, ghErtebat);
    request.input('kaCode', VarChar, kaCode);

    const result = await request.query(getMaxSerialSql);
    const maxSerial = result.recordset[0].maxSerial;

    // Return the maximum serial number
    return maxSerial;
  } catch (error) {
    console.error('Error retrieving maximum serial:', error);
    throw error;
  } finally {
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

    request.input('carno', VarChar, params.tplk);
    request.input('Weight', Int, params.netT);
    request.input('code', VarChar, params.kaCode);
    request.input('Hamlcode', VarChar, params.ghErtebat);
    request.input('Serial', VarChar, params.bar_n_s);
    request.input('barno', Int, params.bar_n);
    request.input('Tarekh', VarChar, params.barDate);
    request.input('tel', VarChar, params.dTel);
    request.input('datedo', VarChar, datedo);
    request.input('accdo', Int, 0);
    request.input('FacRecno', VarChar, null);
    request.input('FacNeed', Int, 1);
    request.input('notification', Int, 0);
    request.input('send', Int, 0);
    request.input('LockDate', VarChar, null);
    request.input('lock', VarChar, null);
    request.input('radef', VarChar, null)
    request.input('Transport_price1', Int, 0);
    request.input('Transport_price2', Int, 0);
    request.input('Transport_price3', Int, 0);

    const sqlCommand = `
          INSERT INTO salbarno (carno, Weight, code, Hamlcode, Serial, barno, Tarekh, tel, datedo, accdo, FacRecno, FacNeed, notification, send, LockDate, lock, Transport_price1, Transport_price2, Transport_price3)
          VALUES (@carno, @Weight, @code, @Hamlcode, @Serial, @barno, @Tarekh, @tel, @datedo, @accdo, @FacRecno, @FacNeed, @notification, @send, @LockDate, @lock, @Transport_price1, @Transport_price2, @Transport_price3)
      `;

    await request.query(sqlCommand);
  } catch (error) {
    console.error('Error inserting record:', error);
    throw error;
  } finally {
    if (pool) await pool.close();
  }
};

