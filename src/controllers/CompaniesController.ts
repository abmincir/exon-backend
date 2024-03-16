import { Request, Response } from 'express';
import { fetchCompanyData, getAllCompanies } from '../services/ComapniesService';

export const getAllCompaniesHandler = async (req: Request, res: any): Promise<void> => {
  try {
    // Extract relevant parameters from the request body or query string
    const { companyCode, date1, time1, date2, time2, reportName } = req.body;

    const data = await fetchCompanyData({ companyCode, date1, time1, date2, time2, reportName });
    return res.status(200).json(data.data);
  } catch (error: any) {
    console.error('Failed to fetch company data:', error);
    res.status(500).send({ error: 'Failed to fetch company data but bd works', details: error?.message ?? error?.toString() ?? "Not Details Listed, Check Logs but bd works" });
  }
};

export const getAllCompaniesData = async (_: Request, res: Response): Promise<void> => {
  try {
    const data = await getAllCompanies();
    return data;
  } catch (error: any) {
    console.error('Failed to fetch company data:', error);
    res.status(500).send({ error: 'Failed to fetch company data but bd works', details: error?.message ?? error?.toString() ?? "Not Details Listed, Check Logs" });
  }
};