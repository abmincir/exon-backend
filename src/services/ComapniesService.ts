import axios from 'axios';
import { DEFAULT_HEADERS } from '../helpers/companies.helper';

// Define constants for headers and base URL as per your API documentation and authentication details
const BASE_URL = 'https://pishrodarya.ir/WorknetWebSite/service/api/Report/thirdparty';

/**
 * Fetches company or companies data based on the provided parameters.
 * @param {object} params - The request parameters including companyCode, dates, times, and reportName.
 * @returns {Promise<any>} The response data from the API.
 */
export const fetchCompanyData = async (params: {
  companyCode: string,
  date1: string,
  time1?: string,
  date2: string,
  time2?: string,
  reportName:string;
}): Promise<any> => {
  try {
    const response = await axios.post(BASE_URL, params, {
      headers: DEFAULT_HEADERS,
    });
    console.log('-------------pure response-----------------')
    console.log(response)
    return response;
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
};

export const getAllCompanies = async (): Promise<any> => {
    try {
      const response = await axios.post(BASE_URL, {
        reportName: "شرکتها"
      }, {
        headers: DEFAULT_HEADERS,
      });
      return response.data;
    } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
};
