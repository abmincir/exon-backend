import axios from 'axios';
import {
  AddressAddRequest,
  AddressDeleteRequest,
  AddressResponse,
  FetchAddressParams,
  BASE_URL,
  DEFAULT_HEADERS,
} from './Address.interface';

export const addAddresses = async (addresses: AddressAddRequest[]): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/Address/add`, addresses, {
      headers: DEFAULT_HEADERS,
    });
    return response;
  } catch (error) {
    console.error('Error adding addresses:', error);
    throw error;
  }
};

export const deleteAddresses = async (requests: AddressDeleteRequest): Promise<AddressResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/Address/delete`, requests, {
      headers: DEFAULT_HEADERS,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting addresses:', error);
    throw error;
  }
};

export const fetchAddresses = async (params: FetchAddressParams): Promise<AddressResponse> => {
  try {
    const queryString = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
    const response = await axios.get(`${BASE_URL}/Address/read/${params.GoodOwnerCood}?${queryString}`, {
      headers: DEFAULT_HEADERS,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};
