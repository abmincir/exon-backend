import axios from 'axios';
import moment from 'moment';

const TOKEN_EXP_MARGIN_MIN = 10;

let TOKEN = ""
let TOKEN_EXP = ""

const depositStatement = async ({
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

  // TODO: these env must be set
  refreshToken()
  const channel = process.env.KOOK_CHANNEL
  const { data, status } = await axios.post<DepositStatementResponseI>(
    "https://kook.sb24.ir:9035/deposit/statment", {
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
  });

  if (status === 409) {
    throw data
  }
  return data;
}

const refreshToken = async () => {
  // TODO: these must be changed in env or in local file
  const username = process.env.KOOK_USERNAME
  const password = process.env.KOOK_PASSWORD
  const channel = process.env.KOOK_CHANNEL
  const secretKey = process.env.KOOK_SECRET_KEY

  if (!TOKEN_EXP) {
    // check if token has been expired
    const diff = moment().diff(TOKEN_EXP, 'minutes')
    if (diff >= TOKEN_EXP_MARGIN_MIN) {
      // token exp is yet to be expired, so avoid login
      return;
    }
  }

  // update token
  const { data } = await axios.post<LoginResponseI>(
    "https://kook.sb24.ir:9000/login", {
    channel,
    username,
    password,
    secretKey,
  });

  if (data.error || data.exception) {
    const { error, fieldErrors, httpStatus, exception, message } = data
    throw { error, fieldErrors, httpStatus, exception, message }
  }

  TOKEN = data.token ?? "";
  TOKEN_EXP = data.expiration ?? "";
}

module.exports = {
  deposit: depositStatement,
}
