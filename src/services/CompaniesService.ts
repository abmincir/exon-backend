import axios from 'axios';

// Define constants for headers and base URL as per your API documentation and authentication details
const BASE_URL = 'https://pishrodarya.ir/WorknetWebSite/service/api/Report/thirdparty';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  // Add 'webUserName', 'webUserPass', 'AuthUser', 'AuthenticationX365' after encoding them as needed
  'webUserName': 'your_webUserName_value',
  'webUserPass': 'your_encoded_webUserPass_value', // Remember to encode this as BASE64 if required
  'AuthUser': 'your_AuthUser_value',
  'AuthenticationX365': 'your_AuthenticationX365_value',
};

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
  reportName: string
}): Promise<any> => {
  try {
    const response = await axios.post(BASE_URL, params, {
      headers: DEFAULT_HEADERS,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
};

