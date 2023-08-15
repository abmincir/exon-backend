import { Request, Response } from 'express'

import { sendError, sendSuccess } from '../helpers/request.helper'

import { Account, IAccountRequestData } from '../models/acount.model'

export const getAll = async (req: Request, res: Response) => {
  try {
    const accounts = await Account.find({}).exec()
    sendSuccess(res, { accounts })
  } catch (err) {
    sendError(res, 'Failed to retrieve accounts', 500, err)
  }
}

export const create = async (req: IAccountRequestData, res: Response) => {
  const { username, title, password } = req.body

  try {
    const foundAccount = await Account.findOne({ username }).exec()
    if (foundAccount) {
      return sendError(res, `Username ${username} already exists`, 400)
    }

    const account = await Account.create({ username, title, password })
    sendSuccess(res, { account })
  } catch (err) {
    sendError(res, 'Failed to create account', 500, err)
  }
}

export const update = async (req: IAccountRequestData, res: Response) => {
  const { _id, username, title, password } = req.body

  try {
    const foundedAccount = await Account.findById(_id).exec()
    if (!foundedAccount) {
      return sendError(res, `User ${_id} does not exist`, 404)
    }

    foundedAccount.username = username
    foundedAccount.title = title
    foundedAccount.password = password

    const updatedAccount = await foundedAccount.save()
    sendSuccess(res, { account: updatedAccount })
  } catch (err) {
    sendError(res, 'Failed to update account', 500, err)
  }
}

export const deleteAccount = async (req: IAccountRequestData, res: Response) => {
  const { _id } = req.body

  try {
    await Account.findByIdAndDelete(_id).exec()
    sendSuccess(res, 'Success', 200)
  } catch (err) {
    sendError(res, 'Failed to delete account', 500, err)
  }
}
