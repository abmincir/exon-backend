export interface DepositStatementInputI {
  cif?: string;
  action?: 'DEBIT' | 'CREDIT';
  englishDescription?: 'PER' | 'EN';
  description?: string;
  depositNumber?: string;
  fromDate?: string;
  toDate?: string;
  length?: number;
  offset?: number;
  order?: 'ASC' | 'DESC';
}

export interface StatementI {
  agentBranchCode: string;
  agentBranchName: string;
  balance: number;
  branchCode: string;
  branchName: string;
  date: string;
  description: string;
  referenceNumber: string;
  registrationNumber: string;
  serial: number;
  serialNumber: string;
  transferAmount: number;
}

export interface DepositStatementResponseI {
  totalRecord?: number;
  statements?: StatementI[];
}

export interface LoginResponseI {
  token?: string;
  expiration?: string;

  error?: string;
  exception?: string;
  message?: string;
  httpStatus?: number;
  fieldErrors?: {
    code?: string;
    field?: string;
    message?: string;
    rejectedValue?: any;
  }[];
}
