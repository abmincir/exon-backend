import moment from 'jalali-moment'

import { Request, Response } from 'express';

import { handleError } from '../helpers/request.helper'
import {
  createDateQuery,
  createDraftInstance,
  createHamlSortObject,
  formatDate,
} from '../helpers/bill.helper'
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

    const foundedDb = await Database.findById(dbId).exec();

    if (!foundedDb) {
      handleError(res, `db ${dbId} does not exists`, 400);
      return;
    }

    for (const draftData of result) {
      try {
        const newDraft = createDraftInstance(draftData, foundedDb.name);
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
    kotaj,
    shipRecno,
    recno,
    meli,
    peygiri,
    shenaseh,
    startDate,
    endDate,
    sort,
  } = req.body;

  let query: any = {};

  if (hamlCode) query.hamlCode = hamlCode;
  if (kotaj) query.kotaj = kotaj;
  if (shipRecno) query.shipRecno = shipRecno;
  if (recno) query.recno = recno;
  if (meli) query.meli = meli;
  if (peygiri) query.peygiri = peygiri;
  if (shenaseh) query.shenaseh = shenaseh;

  const dateQuery = createDateQuery(startDate, endDate);
  if (dateQuery) query.date = dateQuery;

  const sortObj = createHamlSortObject(sort);

  try {
    const drafts = await Draft.find(query).limit(1000).sort(sortObj).exec();
    res.json({ drafts });
  } catch (err) {
    handleError(res, 'Failed to fetch drafts', 422, err);
  }
};

export { getAllDraftsHandler, updateDraftDbHandler };
