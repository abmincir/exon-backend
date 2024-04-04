import { ConnectionPool, VarChar, Int, Float, SmallInt, Numeric, Bit } from 'mssql';
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
    const { tplk, netT, kaCode, kaGrp, dbId } = params;

    const config = await getConfigByDbId(dbId);
    pool = new ConnectionPool(config);
    await pool.connect();

    // Prepare the SQL command for checking duplicates
    const checkDuplicateSql = `
        SELECT COUNT(code) AS count
        FROM salbarno
        WHERE Carno = @tplk
          AND Weight = @netT
          AND Code = @kaCode
          AND Hamlcode = @kaGrp
          AND LEN(carno) > 3
      `;

    // Create a request for executing the SQL command
    const request = pool.request();
    request.input('tplk', VarChar, tplk);
    request.input('netT', Float, netT);
    request.input('kaCode', Int, Number(kaCode));
    request.input('kaGrp', SmallInt, kaGrp);

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
    const { kaCode, kaGrp, dbId } = params;

    const config = await getConfigByDbId(dbId);
    pool = new ConnectionPool(config);
    await pool.connect();

    const getMaxSerialSql = `
        SELECT MAX(serial) AS maxSerial
        FROM salbarno
        WHERE Hamlcode = @kaGrp
          AND Code = @kaCode
      `;

    const request = pool.request();
    request.input('kaGrp', SmallInt, kaGrp);
    request.input('kaCode', Int, kaCode);

    const result = await request.query(getMaxSerialSql);
    console.log('-------------------------max serial-------------------')
    console.log(result.recordset[0])
    const maxSerial = result.recordset[0].maxSerial ;

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

    request.input('Carno', VarChar, params.tplk);
    request.input('Weight', Float, params.netT);
    request.input('Code', Int, params.kaCode);
    request.input('Hamlcode', SmallInt, params.kaGrp);
    request.input('Serial', SmallInt, params.bar_n_s ? params.bar_n_s + 1 : 1);
    request.input('Barno', VarChar, params.bar_n);
    request.input('Tarekh', VarChar, params.barDate);
    request.input('tel', VarChar, params.dTel);
    request.input('DateDo', VarChar, datedo);
    request.input('AccDo', Int, 0);
    request.input('FacRecno', Numeric, null);
    request.input('FacNeed', Bit, 1);
    request.input('notification', Bit, 0);
    request.input('send', Int, 0);
    request.input('LockDate', VarChar, null);
    request.input('Lock', Int, null);
    request.input('Radef', Int, null)
    request.input('Transport_price1', Float, 0);
    request.input('Transport_price2', Float, 0);
    request.input('Transport_price3', Float, 0);

    const sqlCommand = `
          INSERT INTO salbarno (Carno, Weight, Code, Hamlcode, Serial, Barno, Tarekh, tel, DateDo, AccDo, FacRecno, FacNeed, notification, send, LockDate, Lock, Transport_price1, Transport_price2, Transport_price3, Radef)
          VALUES (@Carno, @Weight, @Code, @Hamlcode, @Serial, @Barno, @Tarekh, @tel, @DateDo, @AccDo, @FacRecno, @FacNeed, @notification, @send, @LockDate, @Lock, @Transport_price1, @Transport_price2, @Transport_price3, @Radef)
      `;

    await request.query(sqlCommand);
  } catch (error) {
    console.error('Error inserting record:', error);
    throw error;
  } finally {
    if (pool) await pool.close();
  }
};

