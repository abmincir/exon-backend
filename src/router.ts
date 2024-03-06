import { Application } from 'express'

import * as AddressController from './controllers/AddressController';

import {
  create as createAccountHandler,
  deleteAccount as deleteAccountHandler,
  getAll as getAllAccountsHandler,
  update as updateAccountHandler,
} from './controllers/AccountController'

import {
  auth as authHandler,
  changePassword as changePasswordHandler,
  changeUser as changeUserHandler,
  createUser as createUserHandler,
  deleteUser as deleteUserHandler,
  getAllUsers as getAllUsersHandler,
  getUser as getUserHandler,
} from './controllers/UserController'

import {
  createDatabase as createDatabaseHandler,
  deleteDatabase as deleteDatabaseHandler,
  getAllDatabases as getAllDatabasesHandler,
  updateDatabase as updateDatabaseHandler,
} from './controllers/DatabaseController'

import {
  edit as editBillHandler,
  estelam as estelamBillHandler,
  getAll as getAllBillsHandler,
  updateDb as updateBillDbHandler,
} from './controllers/BillController'

export const router = (app: Application) => {
  app.get('/user', getUserHandler)
  app.get('/user/all', getAllUsersHandler)
  app.post('/user/delete', deleteUserHandler)
  app.post('/user/auth', authHandler)
  app.post('/user/create', createUserHandler)
  app.post('/user/changePassword', changePasswordHandler)
  app.post('/user/changeUser', changeUserHandler)

  app.post('/bill/all', getAllBillsHandler)
  app.post('/bill/fetch', getAllBillsHandler)
  app.post('/bill/update-db', updateBillDbHandler)
  app.post('/bill/estelam', estelamBillHandler)
  app.post('/bill/edit', editBillHandler)

  app.get('/accounts/all', getAllAccountsHandler)
  app.post('/accounts/create', createAccountHandler)
  app.post('/accounts/change-user', updateAccountHandler)
  app.post('/accounts/delete', deleteAccountHandler)

  app.get('/databases/all', getAllDatabasesHandler)
  app.post('/databases/create', createDatabaseHandler)
  app.post('/databases/change-database', updateDatabaseHandler)
  app.post('/databases/delete', deleteDatabaseHandler)

  app.post('/addresses/add', AddressController.addAddresses);
  app.post('/addresses/delete', AddressController.deleteAddresses);
  app.get('/addresses/fetch/:goodOwnerCood', AddressController.fetchAddresses);  
}
