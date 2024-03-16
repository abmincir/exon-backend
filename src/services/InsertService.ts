// import { ConnectionPool, config, IResult } from 'mssql';

// // Assuming `config` is your SQL Server connection configuration
// const pool = new ConnectionPool(config);

// const insertRecord = async (inputData: {
//   companyCode: string,
//   tplk: string,
//   netT: number,
//   kaCode: string,
//   ghErtebat: string,
//   bar_n_s: string,
//   bar_n: number,
//   barDate: string,
//   dTel: string
// }) => {
//     try {
//         await pool.connect();
        
//         // Your SQL command string
//         // This example uses a simplified INSERT command for demonstration purposes
//         // Replace it with your actual SQL command
//         const sqlCommand = `
//             INSERT INTO salbarno (carno, weight, code, hamlcode, serial, barno, tarekh, tel)
//             VALUES (@carno, @weight, @code, @hamlcode, @serial, @barno, @tarekh, @tel)
//         `;
        
//         // Create a new request
//         const request = pool.request();
        
//         // Add parameters from `inputData` to the request to prevent SQL injection
//         request.input('carno', inputData.tplk);
//         request.input('weight', inputData.netT);
//         request.input('code', inputData.kaCode);
//         request.input('hamlcode', inputData.ghErtebat);
//         request.input('serial', inputData.bar_n_s);
//         request.input('barno', inputData.bar_n);
//         request.input('tarekh', inputData.barDate);
//         request.input('tel', inputData.dTel);

//         // Execute the SQL command
//         const result: IResult<any> = await request.query(sqlCommand);
        
//         // Return the result or handle it as needed
//         return result.recordset;
//     } catch (error) {
//         console.error('Error running SQL command:', error);
//         throw error;
//     } finally {
//         // Ensure the connection pool is closed
//         await pool.close();
//     }
// };




// const sql = require('mssql');
// const sqlConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME,
//   server: 'localhost',
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000
//   },
//   options: {
//     encrypt: true, // for azure
//     trustServerCertificate: false // change to true for local dev / self-signed certs
//   }
// };

// const batchUpdateDrafts = async (draftUpdates) => {
//   try {
//     await sql.connect(sqlConfig);
//     const transaction = new sql.Transaction();
    
//     await transaction.begin();

//     for (const update of draftUpdates) {
//       const request = new sql.Request(transaction);
//       const { searchParams, status } = update;

//       // Check for duplicate record
//       const checkDuplicateSql = `
//         SELECT COUNT(code) AS count
//         FROM salbarno 
//         WHERE carno = @tplk 
//           AND weight = @netT 
//           AND code = @kaCode 
//           AND hamlcode = @ghErtebat 
//           AND LEN(carno) > 3
//       `;

//       request.input('tplk', sql.VarChar, searchParams.tplk);
//       request.input('netT', sql.Int, searchParams.netT);
//       request.input('kaCode', sql.VarChar, searchParams.kaCode);
//       request.input('ghErtebat', sql.VarChar, searchParams.ghErtebat);

//       const duplicateResult = await request.query(checkDuplicateSql);
//       const isDuplicate = duplicateResult.recordset[0].count > 0;

//       if (!isDuplicate) {
//         // Retrieve the maximum serial for a given hamlcode and code
//         const getMaxSerialSql = `
//           SELECT MAX(serial) AS maxSerial
//           FROM salbarno
//           WHERE hamlcode = @ghErtebat 
//             AND code = @kaCode
//         `;

//         const serialResult = await request.query(getMaxSerialSql);
//         const maxSerial = serialResult.recordset[0].maxSerial || 0;
//         const nextSerial = maxSerial + 1; // Calculate the next serial

//         // Here you can proceed with inserting a new record using nextSerial as the new serial number
//         // Example insert command using the calculated nextSerial and other necessary parameters
//       } else {
//         console.log('Duplicate record found, skipping update/insert.');
//       }
//     }

//     // Commit the transaction
//     await transaction.commit();
//     console.log('Transaction completed successfully.');
//   } catch (err) {
//     console.error('Failed to process batch updates:', err);
//     // Rollback the transaction if any error occurs
//     if (transaction) await transaction.rollback();
//   } finally {
//     sql.close();
//   }
// };

// // Example usage with dummy data
// const draftUpdates = [
//   {
//     searchParams: { tplk: '941ع87', netT: 26940, kaCode: '19', ghErtebat: '6' },
//     status: 'Updated'
//   },
//   // Add more updates as needed
// ];

// batchUpdateDrafts(draftUpdates);
