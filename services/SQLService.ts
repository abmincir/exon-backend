const sql = require('mssql');

exports.FetchData = (input: { startDate: string; endDate: string }) => {
  const { startDate, endDate } = input;

  // config for your database
  const config = {
    user: 'sa',
    password: 'mis',
    server: 'srv-siniran\\SRV_SINIRAN',
    database: 'XData',
    options: {
      encrypt: true,
      enableArithAbort: true,
      cryptoCredentialsDetails: {
        minVersion: 'TLSv1',
      },
    },
  };

  // connect to your database
  return new Promise((res, rej) => {
    sql.connect(config, (error: Error) => {
      if (error) {
        console.log(error);
        rej(error);
      }
      // create Request object
      const request = new sql.Request();
      request.input('StartDate', sql.VarChar(64), startDate);
      request.input('EndDate', sql.VarChar(64), endDate);

      // query to the database and get the records
      return request
        .execute('__BarnameProc__')
        .then((result: any, error: any) => {
          if (error) {
            console.log(error);
            rej(error);
          }

          res(result.recordset);
        })
        .catch((error: any) => {
          console.log(error);
          rej(error);
        });
    });
  });
};
