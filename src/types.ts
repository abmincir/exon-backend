export interface CheckDuplicateParams {
    tplk: string;
    netT: number;
    kaCode: string;
    kaGrp: string;
    dbId: string;
}
  
export interface GetMaxSerialParams {
    kaCode: string;
    kaGrp: string;
    dbId: string;
}

export interface InsertRecordParams {
    tplk: string; // carno
    netT: number; // weight
    kaCode: string; // code
    ghErtebat: string; // hamlcode
    serial: number; // serial (calculated or passed in)
    bar_n: number; // barno
    barDate: string; // tarekh
    dTel: string; // tel
    dbId: string; // Database ID for fetching connection config
  }

export interface ProcessRecordsResult {
    acknowledgedInserts: number;
    failedInserts: number;
  }

export interface BaseRecord {
    tplk: string;
    netT: number;
    kaCode: string;
    ghErtebat: string;
    bar_n: number;
    barDate: string;
    dTel: string;
    bar_n_s: string; // Serial
    kaGrp: string;
  }
  
  export interface InsertRecordParams extends BaseRecord {
    FacRecno: number;
    FacNeed: number;
    notification: number;
    send: number;
    datedo: string; // Consider handling the date dynamically if needed
    accdo: number;
    LockDate: null;
    lock: number;
  }
  