import { Request, Response } from 'express';
import { fetchCompanyData } from '../services/CompaniesService';

export const getAllCompaniesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract relevant parameters from the request body or query string
    const { companyCode, date1, time1, date2, time2, reportName } = req.body;

    const data = await fetchCompanyData({ companyCode, date1, time1, date2, time2, reportName });

    res.json(data);
  } catch (error: any) {
    console.error('Failed to fetch company data:', error);
    res.status(500).send({ error: 'Failed to fetch company data', details: error?.message ?? error?.toString() ?? "Not Details Listed, Check Logs" });
  }
};

