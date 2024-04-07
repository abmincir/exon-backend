import { checkForDuplicateRecord, getHamlCode, getMaxSerial, insertRecord } from '../helpers/sql.helper';
import { CheckDuplicateParams, ProcessRecordsResult, BaseRecord, GetMaxSerialParams, GetHamlCodeParams } from '../types';

export async function processRecords(records: BaseRecord[], dbId: string): Promise<ProcessRecordsResult> {
  let acknowledgedInserts = 0;
  let failedInserts = 0;
  
  for (const record of records) {
    try {

      const hamlCodeParams : GetHamlCodeParams = {
        billOfLadingCoutageCode: record.billOfLadingCoutageCode,
        dbId
      }
      const hamlCode = await getHamlCode(hamlCodeParams)

      const duplicateCheckParams: CheckDuplicateParams = {
        tplk: record.tplk,
        netT: record.netT,
        kaCode: record.kaCode,
        kaGrp: hamlCode,
        dbId,
      };

      const isDuplicate = await checkForDuplicateRecord(duplicateCheckParams);
      if (isDuplicate) {
        console.log('Duplicate record found, skipping:', record);
        continue;
      }

      const maxSerialParams: GetMaxSerialParams = {
        kaGrp: hamlCode,
        kaCode: record.kaCode,
        dbId,
      };

      const maxSerialNumber = await getMaxSerial(maxSerialParams);
      // TODO use this value



      const insertRecordParams: BaseRecord = {
        tplk: record.tplk,
        netT: record.netT,
        kaCode: record.kaCode,
        ghErtebat: record.ghErtebat,
        bar_n: record.bar_n,
        bar_n_s: maxSerialNumber,
        barDate: record.barDate,
        dTel: record.dTel,
        kaGrp: hamlCode,
        billOfLadingCoutageCode: record.billOfLadingCoutageCode
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
