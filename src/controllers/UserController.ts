import { Request, Response } from 'express'

import { sendError, sendSuccess } from '../helpers/request.helper'

import { User } from '../models/user.model'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const foundedUsers = await User.find({}).exec()

    sendSuccess(res, { users: foundedUsers })
  } catch (err) {
    sendError(res, 'Error fetching users', 500, err)
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { _id } = req.body

  try {
    const foundedUser = await User.findById(_id).exec()

    sendSuccess(res, { user: foundedUser })
  } catch (err) {
    sendError(res, 'Error fetching user', 500, err)
  }
}

export const auth = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    const foundedUser = await User.findOne({ username }).exec()

    if (foundedUser && foundedUser.password === password) {
      sendSuccess(res, { user: foundedUser })
    } else {
      sendError(res, 'Authentication failed', 401)
    }
  } catch (err) {
    sendError(res, 'Error authenticating user', 500, err)
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { username, name, password } = req.body

  try {
    const user = await User.create({ username, name, password })

    sendSuccess(res, { user })
  } catch (err) {
    sendError(res, 'Error creating user', 500, err)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { _id } = req.body

  try {
    const deletedUser = await User.findByIdAndDelete(_id).exec()
    if (deletedUser) {
      sendSuccess(res, 'User deleted', 200)
    } else {
      sendError(res, 'User not found', 404)
    }
  } catch (err) {
    sendError(res, 'Error deleting user', 500, err)
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const { username, password, newPassword } = req.body

  try {
    const foundedUser = await User.findOne({ username }).exec()

    if (foundedUser && foundedUser.password === password) {
      foundedUser.password = newPassword
      const savedUser = await foundedUser.save()

      sendSuccess(res, { user: savedUser })
    } else {
      sendError(res, 'Authentication failed', 401)
    }
  } catch (err) {
    sendError(res, 'Error changing password', 500, err)
  }
}

export const changeUser = async (req: Request, res: Response) => {
  const { _id, username, name, password } = req.body

  try {
    const foundedUser = await User.findById(_id).exec()

    if (!foundedUser) {
      sendError(res, 'User not found', 404)
      return
    }

    foundedUser.username = username ?? foundedUser.username
    foundedUser.name = name ?? foundedUser.name
    foundedUser.password = password ?? foundedUser.password
    const savedUser = await foundedUser.save()

    sendSuccess(res, { user: savedUser })
  } catch (err) {
    sendError(res, 'Error updating user', 500, err)
  }
}
