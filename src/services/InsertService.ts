import { ConnectionPool, config, IResult } from 'mssql';

// Assuming `config` is your SQL Server connection configuration
const pool = new ConnectionPool(config);

const insertRecord = async (inputData: {
  companyCode: string,
  tplk: string,
  netT: number,
  kaCode: string,
  ghErtebat: string,
  bar_n_s: string,
  bar_n: number,
  barDate: string,
  dTel: string
}) => {
    try {
        await pool.connect();
        
        // Your SQL command string
        // This example uses a simplified INSERT command for demonstration purposes
        // Replace it with your actual SQL command
        const sqlCommand = `
            INSERT INTO salbarno (carno, weight, code, hamlcode, serial, barno, tarekh, tel)
            VALUES (@carno, @weight, @code, @hamlcode, @serial, @barno, @tarekh, @tel)
        `;
        
        // Create a new request
        const request = pool.request();
        
        // Add parameters from `inputData` to the request to prevent SQL injection
        request.input('carno', inputData.tplk);
        request.input('weight', inputData.netT);
        request.input('code', inputData.kaCode);
        request.input('hamlcode', inputData.ghErtebat);
        request.input('serial', inputData.bar_n_s);
        request.input('barno', inputData.bar_n);
        request.input('tarekh', inputData.barDate);
        request.input('tel', inputData.dTel);

        // Execute the SQL command
        const result: IResult<any> = await request.query(sqlCommand);
        
        // Return the result or handle it as needed
        return result.recordset;
    } catch (error) {
        console.error('Error running SQL command:', error);
        throw error;
    } finally {
        // Ensure the connection pool is closed
        await pool.close();
    }
};

// Example usage with dummy data
insertRecord({
  companyCode: "36678",
  tplk: "941ع87",
  netT: 26940,
  kaCode: "19",
  ghErtebat: "6",
  bar_n_s: "14/1402",
  bar_n: 3944463,
  barDate: "02/12/23",
  dTel: "09168477918-09199014179"
}).then(result => {
  console.log("Insert operation result:", result);
}).catch(error => {
  console.error("Insert operation failed:", error);
});
