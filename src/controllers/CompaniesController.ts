import { Request, Response } from 'express';
// FIXME fix this typoe later (ComapniesService -> CompaniesService)
import { fetchCompanyData } from '../services/ComapniesService';
import { processRecords } from '../services/InsertService';
import { CompaniesApiResponse } from '../services/Company.interface';
import { BaseRecord } from '../types';

const mapApiResponseToBaseRecords = (apiResponse: CompaniesApiResponse): BaseRecord[] => {
  return apiResponse.data.value.map((record): BaseRecord => ({
    tplk: record.tplk,
    netT: record.netT,
    kaCode: record.kaCode,
    ghErtebat: record.ghErtebat,
    bar_n: record.bar_n,
    bar_n_s: record.bar_n_s,
    barDate: record.barDate,
    dTel: record.dTel,
    kaGrp: record.kaGrp,
    billOfLadingCoutageCode: record.billOfLadingCoutageCode
  }));
};

export const getAllCompaniesHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyCode, date1, time1, date2, time2, reportName } = req.body;
    const data: CompaniesApiResponse = await fetchCompanyData({ companyCode, date1, time1, date2, time2, reportName });

    const records: BaseRecord[] = mapApiResponseToBaseRecords(data);

    res.status(200).json({ records });
  } catch (error: any) {
    console.error('Failed to fetch company data:', error);
    res.status(500).send({ error: 'Failed to fetch company data', details: error?.message ?? "Not Details Listed, Check Logs" });
  }
};

export const processCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { records, dbId } = req.body;
    const result = await processRecords(records, dbId);

    res.status(200).json({ result });
  } catch (error: any) {
    console.error('Failed to process company records: ', error);
    res.status(500).send({ error: 'Failed to process company records', details: error?.message ?? "Not Details Listed, Check Logs" });
  }
}
