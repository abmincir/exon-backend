import { Request, Response } from 'express'

import { sendError, sendSuccess } from '../helpers/request.helper'

import { Database, IDatabase } from '../models/database.model'

export const getAllDatabases = async (_req: Request, res: Response) => {
  try {
    const foundedDbs: IDatabase[] = await Database.find().exec()
    sendSuccess(res, { dbs: foundedDbs })
  } catch (err) {
    sendError(res, 'Error fetching databases', 500, err)
  }
}

export const createDatabase = async (req: Request, res: Response) => {
  const { name, title, username, password, address, proc, isShamsi } = req.body

  try {
    const foundDb = await Database.findOne({ name }).exec()
    if (foundDb) {
      sendError(res, `Database ${name} already exists`, 400)
      return
    }

    const newDb: IDatabase = await Database.create({
      name,
      title,
      username,
      password,
      address,
      proc,
      isShamsi,
    })

    sendSuccess(res, { db: newDb })
  } catch (err) {
    sendError(res, 'Error creating database', 500, err)
  }
}

export const updateDatabase = async (req: Request, res: Response) => {
  const { name, title, username, password, address, proc, isShamsi } = req.body

  try {
    const foundedDatabase = await Database.findOne({ name }).exec()
    if (!foundedDatabase) {
      sendError(res, `Database ${name} does not exist`, 400)
      return
    }

    foundedDatabase.name = name
    foundedDatabase.title = title
    foundedDatabase.username = username
    foundedDatabase.password = password
    foundedDatabase.address = address
    foundedDatabase.proc = proc
    foundedDatabase.isShamsi = isShamsi

    const updatedDatabase: IDatabase = await foundedDatabase.save()

    sendSuccess(res, { db: updatedDatabase })
  } catch (err) {
    sendError(res, 'Error updating database', 500, err)
  }
}

export const deleteDatabase = async (req: Request, res: Response) => {
  const { _id } = req.body

  try {
    await Database.findByIdAndDelete(_id).exec()
    sendSuccess(res, 'Database deleted', 201)
  } catch (err) {
    sendError(res, 'Error deleting database', 500, err)
  }
}
