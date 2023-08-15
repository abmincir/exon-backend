import { Response } from 'express'

export const sendError = (res: Response, error: string, statusCode: number = 500, err?: any) => {
  res.status(statusCode).send({ error, details: err })
}

export const sendSuccess = (res: Response, data: any, statusCode: number = 200) => {
  res.status(statusCode).send(data)
}

export const defaultHeaders = (res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
}

export const handleError = (res: Response, errorMessage: string, statusCode: number, error?: any) => {
  sendError(res, errorMessage, statusCode, error)
}
