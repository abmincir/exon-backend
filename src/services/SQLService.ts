import { ConnectionPool, IResult, VarChar } from 'mssql';
import { SecureVersion } from 'tls';

import { Database } from '../models/database.model';

export const FetchData = async (input: {
  startDate: string;
  endDate: string;
  startDateMiladi: string;
  endDateMiladi: string;
  dbId: string;
}): Promise<any> => {
  let pool;

  try {
    const foundedDb = await Database.findById(input.dbId).exec();

    if (!foundedDb || !foundedDb._id) {
      throw new Error(`db ${input.dbId} does not exists`);
    }

    const config = {
      user: foundedDb.username,
      password: foundedDb.password,
      server: foundedDb.address,
      database: foundedDb.name,
      options: {
        encrypt: false,
        enableArithAbort: true,
        cryptoCredentialsDetails: {
          minVersion: 'TLSv1.3' as SecureVersion,
        },
      },
    };

    pool = new ConnectionPool(config);
    await pool.connect();

    const request = pool.request();
    request.input(
      foundedDb.isShamsi ? 'StartDate' : 'Start',
      VarChar(64),
      foundedDb.isShamsi ? input.startDate : input.startDateMiladi,
    );
    request.input(
      foundedDb.isShamsi ? 'EndDate' : 'End',
      VarChar(64),
      foundedDb.isShamsi ? input.endDate : input.endDateMiladi,
    );

    const result: IResult<any> = await request.execute(foundedDb.proc);

    return result.recordset;
  } catch (error) {
    console.log("loh")
    console.error(error);
    throw error;
  } finally {
    if (pool) await pool.close();
  }
};
