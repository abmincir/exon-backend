import axios from 'axios';
import {
  DepositStatementInputI,
  DepositStatementResponseI,
  LoginResponseI,
} from '../types/KookService.types';

let TOKEN = '';

export const depositStatement = async ({
  cif,
  action,
  englishDescription,
  description,
  depositNumber,
  fromDate,
  toDate,
  length,
  offset,
  order,
}: DepositStatementInputI) => {
  refreshToken();
  // FIXME remove this, just for test
  return;

  const channel = process.env.KOOK_CHANNEL;
  const { data, status } = await axios.post<DepositStatementResponseI>(
    'https://kook.sb24.ir:9035/deposit/statment',
    {
      token: TOKEN,
      channel,
      cif,
      action,
      englishDescription,
      description,
      depositNumber,
      fromDate,
      toDate,
      length,
      offset,
      order,
    },
  );

  if (status === 409) {
    throw data;
  }

  return data;
};

const refreshToken = async () => {
  const username = process.env.KOOK_USERNAME;
  const password = process.env.KOOK_PASSWORD;
  const channel = process.env.KOOK_CHANNEL;
  const secretKey = process.env.KOOK_SECRET_KEY;

  const json = JSON.stringify({
    channel,
    username,
    password,
    secretKey,
  });

  console.log(json);

  const { data } = await axios.post<LoginResponseI>(
    'https://kook.sb24.ir:9000/login',
    json,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (data.error || data.exception || !!data.token === false) {
    const { error, fieldErrors, httpStatus, exception, message } = data;
    throw { error, fieldErrors, httpStatus, exception, message };
  }

  console.log(`Fetched Token  -> ${data.token}`);
  TOKEN = data.token ?? '';
};
