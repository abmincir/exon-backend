import axios from 'axios';
import moment from 'moment';

import {
  DepositStatementInputI,
  DepositStatementResponseI,
  LoginResponseI,
} from '../types/KookService.types';

let TOKEN = '';

export const depositStatement = async () => {
  await refreshToken();

  const { data, status } = await axios.post<DepositStatementResponseI>(
    'https://kook.sb24.ir:9004/deposit/statement',
    {
      action: 'CREDIT',
      channel: 'keshtvasanat_ekson_ch',
      depositNumber: '826-40-33936000-1',
      length: 500,
      offset: 0,
      order: 'DESC',
      fromDate: moment().subtract(7, 'days').startOf('day').toISOString(),
      toDate: moment().endOf('day').toISOString(),
      token: TOKEN,
    }
  );

  if (status === 409) {
    throw data;
  }

  return data.statements;
};

const refreshToken = async () => {
  const username = process.env.KOOK_USERNAME;
  const password = process.env.KOOK_PASSWORD;
  const channel = process.env.KOOK_CHANNEL;
  const secretkey = process.env.KOOK_SECRET_KEY;

  const { data } = await axios.post<LoginResponseI>(
    'https://kook.sb24.ir:9000/login',
    {
      channel,
      username,
      password,
      secretkey,
    }
  );

  if (data.error || data.exception || !!data.token === false) {
    const { error, fieldErrors, httpStatus, exception, message } = data;
    throw { error, fieldErrors, httpStatus, exception, message };
  }

  console.log(`Fetched Token  -> ${data.token}`);
  TOKEN = data.token ?? '';
};
