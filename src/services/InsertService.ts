import { checkForDuplicateRecord, insertRecord } from '../helpers/sql.helper';
import { CheckDuplicateParams, ProcessRecordsResult, BaseRecord } from '../types';

export async function processRecords(records: BaseRecord[], dbId: string): Promise<ProcessRecordsResult> {
  let acknowledgedInserts = 0;
  let failedInserts = 0;

  for (const record of records) {
    try {
      const duplicateCheckParams: CheckDuplicateParams = {
        tplk: record.tplk,
        netT: record.netT,
        kaCode: record.kaCode,
        ghErtebat: record.ghErtebat,
        dbId,
      };

      const isDuplicate = await checkForDuplicateRecord(duplicateCheckParams);
      if (isDuplicate) {
        console.log('Duplicate record found, skipping:', record);
        continue;
      }

      const insertRecordParams: BaseRecord = {
        tplk: record.tplk,
        netT: record.netT,
        kaCode: record.kaCode,
        ghErtebat: record.ghErtebat,
        bar_n: record.bar_n,
        bar_n_s: record.bar_n_s,
        barDate: record.barDate,
        dTel: record.dTel,
      };

      await insertRecord(insertRecordParams, dbId);
      acknowledgedInserts++;
    } catch (error) {
      console.error('Error processing record:', record, error);
      failedInserts++;
    }
  }

  return { acknowledgedInserts, failedInserts };
}