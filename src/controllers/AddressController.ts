import { Request, Response } from 'express';
import * as AddressService from '../services/AddressService';

export const addAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = req.body;
    const result = await AddressService.addAddresses(addresses);
    res.json(result);
  } catch (error: any) {
    res.status(500).send({ error: 'Failed to add addresses', details: error.message });
  }
};

export const deleteAddresses = async (req: Request, res: Response) => {
  try {
    const requests = req.body;
    const result = await AddressService.deleteAddresses(requests);
    res.json(result);
  } catch (error: any) {
    res.status(500).send({ error: 'Failed to delete addresses', details: error.message });
  }
};

export const fetchAddresses = async (req: Request, res: Response) => {
  try {
    const params = {
      GoodOwnerCood: req.params.goodOwnerCood,
      ...req.query
    };
    const result = await AddressService.fetchAddresses(params);
    res.json(result);
  } catch (error: any) {
    res.status(500).send({ error: 'Failed to fetch addresses', details: error.message });
  }
};
