exports.FetchData = () => {
  const sql = require('mssql');
  // config for your database
  const config = {
    user: 'sa',
    password: 'mis',
    server: 'srv-siniran\\SRV_SINIRAN',
    database: 'XData',
  };

  // connect to your database
  sql.connect(config, (err: Error) => {
    if (err) console.log(err);

    // create Request object
    const request = new sql.Request();

    // add input variables
    request.input('City', sql.VarChar(30), 'Cbe');
    request.input('NameNew', sql.VarChar(30), 'Cbe');

    // execute the procedure
    request
      .execute('spTest')
      .then((err: any, recordSets: any, returnValue: any, affected: any) => {
        console.dir(recordSets);
        console.dir(err);
      })
      .catch((err: any) => {
        console.log(err);
      });
  });
};
