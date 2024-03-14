import moment from 'jalali-moment'

import { Request, Response } from 'express'

import {
  createBillInstance,
  createDateQuery,
  createSortObject,
  formatDate,
  handleBillNotFound,
  handleMatchingWeight,
  handleWeightMismatch,
} from '../helpers/bill.helper'
import { handleError, sendError, sendSuccess } from '../helpers/request.helper'

import { Account } from '../models/acount.model'
import { Bill, IBillByDateRequestData, IBillRequestData } from '../models/bill.model'
import { Database } from '../models/database.model'
import { User } from '../models/user.model'

import { edit as editService, estelamByDate, estelam as estelamService } from '../services/SPSWSService'
import { FetchData } from '../services/SQLService'
import { Draft, IDraft } from '../models/draft.model'

export const estelamByDateHandler :(req:Request<IBillByDateRequestData> , res:any) => Promise<void> = async (req,res)=>{
  const {startDate,endDate} = req.body
  try{
    const result = await estelamByDate(startDate,endDate)
    sendSuccess(res,result)
  }
  catch(err){
    handleError(res, 'Failed to process request', 550, err)
  }

}

const estelamHandler: (req: Request<IBillRequestData>, res: Response) => Promise<void> = async (req, res) => {
  const { _id, purchaseId, billNumber, weight, accountId, username } = req.body

  try {
    const foundedAcc = await Account.findOne({ _id: accountId }).exec()

    if (!foundedAcc) {
      handleError(res, `Account ${accountId} does not exist.`, 400)
      return
    }

    let foundedUser = { username: 'ADMIN' } as any

    if (username) {
      foundedUser = await User.findOne({ username }).exec()

      if (!foundedUser) {
        handleError(res, `User ${username} does not exist.`, 400)
        return
      }
    }

    const result = await estelamService(purchaseId, foundedAcc.username, foundedAcc.password)
    const foundedBill = result.find((bill: any) => bill.billNumber === billNumber)

    if (!foundedBill) {
      await handleBillNotFound(_id, weight, foundedAcc, foundedUser)
    } else if (weight !== foundedBill.weight) {
      await handleWeightMismatch(_id, weight, foundedBill, foundedAcc, foundedUser)
    } else {
      await handleMatchingWeight(_id, foundedBill, foundedAcc, foundedUser)
    }

    sendSuccess(res, { result, edit: true })
  } catch (error) {
    handleError(res, 'Failed to process request', 550, error)
  }
}

const editHandler: (req: Request<IBillRequestData>, res: Response) => Promise<void> = async (req, res) => {
  const { _id, weight, accountId } = req.body

  try {
    const foundedAcc = await Account.findOne({ _id: accountId }).exec()

    if (!foundedAcc) {
      handleError(res, `Account ${accountId} does not exist.`, 400)
      return
    }

    const bill = await Bill.findById(_id)

    const result = await editService(_id, bill, weight, foundedAcc.username, foundedAcc.password)
    sendSuccess(res, { result })
  } catch (error) {
    handleError(res, 'Failed to edit bill', 500, error)
  }
}

const getAllHandler: (req: Request, res: Response) => Promise<Response | void> = async (req, res) => {
  const {
    startDateBill,
    endDateBill,
    startDateSave,
    endDateSave,
    billNumber,
    purchaseNumber,
    status: rawStatus,
    productName,
    sort,
    dbId,
  } = req.body

  const foundedDb = await Database.findById(dbId).exec()

  if (!foundedDb) {
    handleError(res, `db ${dbId} does not exists`, 400)
    return
  }

  const status = rawStatus || rawStatus === '0' ? +rawStatus : -2
  let query: any = { dbName: foundedDb.name }

  if (status !== -2) query.status = status
  if (productName) query['product.name'] = productName
  if (billNumber) query['bill.number'] = billNumber
  if (purchaseNumber) query.purchaseId = purchaseNumber

  const dateQuery = createDateQuery(startDateBill, endDateBill)
  if (dateQuery) query.date = dateQuery

  const createdQuery = createDateQuery(startDateSave, endDateSave)
  if (createdQuery) query.created = createdQuery

  const sortObj = createSortObject(sort)

  try {
    const foundedBill = await Bill.find(query).limit(1000).sort(sortObj).exec()
    res.json({ bill: foundedBill })
  } catch (err) {
    handleError(res, 'we have an issue', 422, err)
  }
}

const updateDbHandler: (req: Request, res: Response) => Promise<Response | void> = async (req, res) => {
  let { startDate, endDate, dbId } = req.body

  if (!startDate || !endDate) {
    startDate = moment().locale('fa').format('YYYY/MM/DD')
    endDate = moment().locale('fa').add(1, 'day').format('YYYY/MM/DD')
  }

  const { miladi: startDateMiladi, mongo: startDateMongo } = formatDate(startDate)
  const { miladi: endDateMiladi, mongo: endDateMongo } = formatDate(endDate)

  try {
    const result: any[] = await FetchData({
      startDate,
      endDate,
      startDateMiladi,
      endDateMiladi,
      dbId,
    })

    const foundedDb = await Database.findById(dbId).exec()

    if (!foundedDb) {
      handleError(res, `db ${dbId} does not exists`, 400)
      return
    }

    let savedBills = 0
    let saveErrors = 0
    let alreadySavedBills = 0

    for (const bill of result) {
      const createdBill = createBillInstance(bill, foundedDb.name)

      const existingBill = await Bill.find({ 'bill.id': createdBill.bill.id }).exec()

      if (!existingBill.length) {
        try {
          await createdBill.save()
          savedBills++
        } catch (err) {
          saveErrors++
          console.error('not saved -> error: ', err)
        }
      } else {
        alreadySavedBills++
      }
    }

    const bills = await Bill.find({
      created: {
        $gte: new Date(startDateMongo),
        $lte: new Date(endDateMongo),
      },
    }).exec()

    res.json({ bill: bills })
  } catch (err) {
    console.error(' --------- SQL ERROR ', err)
    handleError(res, 'we have an issue', 422, err)
  }
}

const updateDraftDbHandler: (req: Request, res: Response) => Promise<Response | void> = async (req, res) => {
  let { startDate, endDate, dbId } = req.body;

  if (!startDate || !endDate) {
    startDate = moment().locale('fa').format('YYYY/MM/DD');
    endDate = moment().locale('fa').add(1, 'day').format('YYYY/MM/DD');
  }

  const { miladi: startDateMiladi, mongo: startDateMongo } = formatDate(startDate)
  const { miladi: endDateMiladi, mongo: endDateMongo } = formatDate(endDate)

  try {
    const result: IDraft[] = await FetchData({
      startDate,
      endDate,
      startDateMiladi,
      endDateMiladi,
      dbId,
    });


    let savedDrafts = 0;
    let saveErrors = 0;

    for (const draftData of result) {
      try {
        const newDraft = new Draft(draftData);
        await newDraft.save();
        savedDrafts++;
      } catch (err) {
        console.error('Draft not saved -> error:', err);
        saveErrors++;
      }
    }

    res.json({ message: "Draft DB updated",data:result, savedDrafts, saveErrors });
  } catch (err) {
    console.error('Error updating draft DB:', err);
    handleError(res, 'Failed to update draft DB', 422, err);
  }
};

export { editHandler as edit, estelamHandler as estelam, getAllHandler as getAll, updateDbHandler as updateDb, updateDraftDbHandler as updateDraftDB }
