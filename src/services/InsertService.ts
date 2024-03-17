import { checkForDuplicateRecord, getMaxSerial, insertRecord } from '../helpers/sql.helper';
import { CheckDuplicateParams, InsertRecordParams, GetMaxSerialParams, ProcessRecordsResult, BaseRecord } from '../types';

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

      const maxSerialParams: GetMaxSerialParams = {
        ghErtebat: record.ghErtebat,
        kaCode: record.kaCode,
        dbId,
      };

      const maxSerialNumber = await getMaxSerial(maxSerialParams);

      const insertRecordParams: InsertRecordParams = {
        tplk: record.tplk,
        netT: record.netT,
        kaCode: record.kaCode,
        ghErtebat: record.ghErtebat,
        // FIXME check if this logic is what we want for SinIran
        serial: maxSerialNumber + 1, // Assuming you want to increment the serial number
        bar_n: record.bar_n,
        barDate: record.barDate,
        dTel: record.dTel,
        dbId,
      };

      await insertRecord(insertRecordParams);
      acknowledgedInserts++;
    } catch (error) {
      console.error('Error processing record:', record, error);
      failedInserts++;
    }
  }

  return { acknowledgedInserts, failedInserts };
}