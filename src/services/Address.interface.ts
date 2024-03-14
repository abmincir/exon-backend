export const BASE_URL = 'https://pishrodarya.ir/services/AddressService/api';
export const DEFAULT_HEADERS = {
  'accept': 'text/plain',
  'Content-Type': 'application/json',
  'AuthUser': 'Iedeh_Pardazan_KarAfarin', 
  'AuthenticationX365': '592af739f9fa47839feca8bf9d753e55B7A7F6E827D646B7ABE3ACC2F44F5C69',
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
  shenaseKharid:string;
  shenaseTakhsis:string;
  explanations?:string;
  groupCode:string;
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
