import { BaseRecord } from "../types";

// Types.ts
export interface CompanyRecord {
    companyCode: string;
    barDel: boolean;
    barTime: string;
    barDate: string;
    bar_n: number;
    bar_n_s: string;
    havNum: number;
    dMeli: null | string;
    dTel: string;
    bbtgHararCode: null | string;
    paking: null | string;
    kalaDesc: null | string;
    gH_Code: null | string;
    explain: null | string;
    wH1: number;
    wH2: number;
    many1: number;
    netT: number;
    kaCode: string;
    barGCode: null | string;
    tAmar: null | string;
    factory: null | string;
    kra1: number;
    kra2: number;
    pish: number;
    barArzesh: number;
    daryafti: number;
    ghComp: number;
    comp: number;
    ghPaia: number;
    paia: number;
    afzode: number;
    barBim: number;
    barBimAfzode: number;
    tambar: number;
    bor: number;
    dName: string;
    dFam: string;
    kind: null | string;
    tplk: string;
    plName: string;
    tsp: string;
    dateSals: null | string;
    barMabda: null | string;
    ostanMabda: null | string;
    targetCity: null | string;
    ostanMaghsad: null | string;
    hazTakh: number;
    bargiriMab: number;
    azA2: number;
    bus: number;
    fere_E_Code: null | string;
    fere: null | string;
    ghFereAdd: null | string;
    ka_E_Code: string;
    tarGetName: string;
    barExp: null | string;
    mbkhaal: number;
    ghErtebat: string;
    kaGrp: string;
    barAdd: string;
    grpName: string;
    receiverShKharid: null | string;
    receiverShTakhsis: null | string;
    billOfLadingCoutageCode: string;
}

export interface CompaniesApiResponse {
    value: CompanyRecord[];
    formatters: any[];
    contentTypes: any[];
    declaredType: null;
    statusCode: number;
}

export interface ProcessRecordsInput {
    records: BaseRecord[];
    dbId: string;
}