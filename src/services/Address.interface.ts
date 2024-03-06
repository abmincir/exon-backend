export const BASE_URL = 'https://pishrodarya.ir/services/AddressService/api';
export const DEFAULT_HEADERS = {
  'accept': 'text/plain',
  'Content-Type': 'application/json',
  'AuthUser': '{AuthUser_Value}', // Replace with actual value
  'AuthenticationX': '365', // This seems to be a constant value; adjust if necessary
};

export interface AddressCommonRequest {
  goId: string;
  hamlCode: string;
  companyCode: string;
  havCode: string;
}

export interface AddressAddRequest extends AddressCommonRequest {
  receiverName: string;
  receiverAddress: string;
  receiverPostalCode: string;
  receiverTel: string;
  receiverNationalCode: string;
  receiverJahadYektaCode: string;
  weight: number;
  sendTraili: boolean;
}

export type AddressDeleteRequest = AddressCommonRequest[];

export interface AddressResponse {
  status: string; // Assumed field, adjust according to actual API response
}

export interface FetchAddressParams {
  GoodOwnerCood: string;
  hamlCode?: string;
  companyCode?: string;
  havCode?: string;
  fromDate?: string; // Assuming ISO date format
  toDate?: string; // Assuming ISO date format
}
