import moment from 'jalali-moment'

import { Request, Response } from 'express';

import { handleError } from '../helpers/request.helper'
import {
  createDraftInstance,
  createHamlSortObject,
  formatDate,
} from '../helpers/draft.helper'
import {createDateQuery} from '../helpers/bill.helper'
import { FetchData } from '../services/SQLService';
import { Database } from '../models/database.model';
import { Draft } from '../models/draft.model';


const updateDraftDbHandler: (req: Request, res: Response) => Promise<Response | void> = async (req, res) => {
  let { startDate, endDate, dbId } = req.body;

  if (!startDate || !endDate) {
    startDate = moment().locale('fa').format('YYYY/MM/DD');
    endDate = moment().locale('fa').add(1, 'day').format('YYYY/MM/DD');
  }

  const { miladi: startDateMiladi, mongo: startDateMongo } = formatDate(startDate);
  const { miladi: endDateMiladi, mongo: endDateMongo } = formatDate(endDate);

  try {
    const result = await FetchData({
      startDate,
      endDate,
      startDateMiladi,
      endDateMiladi,
      dbId,
    });


    for (const draftData of result) {
      try {
        const newDraft = createDraftInstance(draftData);
        await newDraft.save();
      } catch (err) {
        console.error('Draft not saved -> error:', err);
      }
    }

    const drafts = await Draft.find({
      date: {
        $gte: new Date(startDateMongo),
        $lte: new Date(endDateMongo),
      },
    }).exec()


    res.json({ drafts })
  } catch (err) {
    console.error('Error updating draft DB:', err);
    handleError(res, 'Failed to update draft DB', 422, err);
  }
};


const getAllDraftsHandler: (req: Request, res: Response) => Promise<Response | void> = async (req, res) => {
  const {
    hamlCode,
    code,
    bargah,
    shenaseh,
    startDate,
    endDate,
    sort,
  } = req.body;

  console.log(req.body)

  let query: any = {};

  if (code) query.code = code
  if (hamlCode) query.hamlCode = hamlCode
  if (bargah) query.bargah = bargah
  if (shenaseh) query.shenaseh = shenaseh

  const dateQuery = createDateQuery(startDate, endDate);
  if (dateQuery) query.date = dateQuery

  const sortObj = createHamlSortObject(sort);
  console.log('before try')
  try {
    const drafts = await Draft.find(query).limit(1000).sort(sortObj).exec();
    console.log(drafts)
    return res.status(200).json(drafts)
  } catch (err) {
    console.log(err)
    handleError(res, 'Failed to fetch drafts', 422, err);
  }
};

export { getAllDraftsHandler, updateDraftDbHandler };