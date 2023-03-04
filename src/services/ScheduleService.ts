const cron = require('node-cron');

import { depositStatement } from '../services/KooKService';
import { insertPaySamanBankInfo } from '../services/SQLService';

export const SamanSchedule = async () => {
  cron.schedule('* */5 * * * *', async function () {
    console.log('---------------------');
    console.log('running a task every 5 minutes');

    const data = await depositStatement();

    data.forEach(async (data) => {
      await insertPaySamanBankInfo(data);
    });
  });
};
