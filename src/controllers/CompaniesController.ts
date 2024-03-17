import { Request, Response } from 'express';
import { fetchCompanyData, getAllCompanies } from '../services/ComapniesService';
import { processRecords } from '../services/InsertService'; // Ensure correct path
import { BaseRecord } from '../types'; // Ensure correct path

export const getAllCompaniesHandler = async (req: Request, res: any): Promise<void> => {
  try {
    const { companyCode, date1, time1, date2, time2, reportName } = req.body;

    const data = await fetchCompanyData({ companyCode, date1, time1, date2, time2, reportName });
    return res.status(200).json(data.data);
  } catch (error: any) {
    console.error('Failed to fetch company data:', error);
    res.status(500).send({ error: 'Failed to fetch company data but bd works', details: error?.message ?? error?.toString() ?? "Not Details Listed, Check Logs but bd works" });
  }
};

// export const getAllCompaniesData = async (_: Request, res: Response): Promise<void> => {
//   try {
//     const data = await getAllCompanies();
//     return data;
//   } catch (error: any) {
//     console.error('Failed to fetch company data:', error);
//     res.status(500).send({ error: 'Failed to fetch company data but bd works', details: error?.message ?? error?.toString() ?? "Not Details Listed, Check Logs" });
//   }
// };

export const insertCompaniesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming the request body will contain an array of records and dbId
    const { records, dbId } = req.body;
    
    if (!records || !dbId) {
      res.status(400).json({ error: 'Missing records or dbId in the request body' });
      return;
    }

    // Process records with the provided dbId
    const { acknowledgedInserts, failedInserts } = await processRecords(records as BaseRecord[], dbId);
    
    res.json({
      message: 'Records processed successfully',
      acknowledgedInserts,
      failedInserts,
    });
  } catch (error: any) {
    console.error('Error processing company insert records:', error);
    res.status(500).send({
      error: 'Failed to insert company records!', 
      details: error?.message ?? error?.toString() ?? "Not Details Listed, Check Logs ..."
    });
  }
};

// example of proper json data
// {
//   "records": [
//     {
//       "tplk": "someValue",
//       "netT": 12345,
//       "kaCode": "someCode",
//       "ghErtebat": "someHamlcode",
//       "bar_n": 123,
//       "barDate": "2022-01-01",
//       "dTel": "123456789"
//     }
//   ],
//   "dbId": "your_database_id_here"
// }
