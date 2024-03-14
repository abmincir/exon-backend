import { Request, Response } from 'express';
import { addressMapper, updateDraftsIndividually } from '../helpers/address.helper';
import * as AddressService from '../services/AddressService';

export const addAddresses = async (req: Request, res: any) => {
  try {
    const addresses = req.body;
    const result = await AddressService.addAddresses(addresses);
    console.log(result.data)

    // setting the status for each draft
    updateDraftsIndividually(addressMapper(result.data))

    return res.status(200).json(result.data)
  } catch (error:any) {
    res.status(500).send({ error: 'Failed to add addresses', details: error.message });
    console.log(error)
  }
};

export const deleteAddresses = async (req: Request, res: any) => {
  try {
    const requests = req.body;
    const result = await AddressService.deleteAddresses(requests);
    console.log(res)
    console.log(result)
    return res.status(200).json(result)
  } catch (error:any) {
    res.status(500).send({ error: 'Failed to delete addresses', details: error.message });
    console.log(error)
  }
};

export const fetchAddresses = async (req: Request, res: any) => {
  try {
    const params = {
      GoodOwnerCood: req.params.goodOwnerCood,
      ...req.query
    };
    const result = await AddressService.fetchAddresses(params);
    return res.status(200).json(result)
  } catch (error:any) {
    res.status(500).send({ error: 'Failed to fetch addresses', details: error.message });
  }
};
