import { Request, Response } from 'express';
import { fetchCompanyData } from '../services/CompaniesService';

export const getAllCompaniesHandler = async (_: Request, res: Response): Promise<void> => {
  try {
    const data = await fetchCompanyData();
    res.json(data);
  } catch (error: any) {
    console.error('Failed to fetch company data:', error);
    res.status(500).send({ error: 'Failed to fetch company data', details: error?.message ?? error?.toString() ?? "Not Details Listed, Check Logs" });
  }
};

