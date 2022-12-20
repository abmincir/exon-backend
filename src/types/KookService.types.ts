interface DepositStatementInputI {
  cif?: string
  action?: 'DEBIT' | 'CREDIT'
  englishDescription?: 'PER' | 'EN'
  description?: string
  depositNumber?: string
  fromDate?: string
  toDate?: string
  length?: number
  offset?: number
  order?: 'ASC' | 'DESC'
}

interface DepositStatementResponseI {
  totalRecord?: number
  statements?: {
    agentBranchCode?: string;
    agentBranchName?: string;
    balance?: number;
    branchCode?: string;
    branchName?: string;
    date?: string;
    description?: string;
    paymentId?: string;
    referenceNumber?: string;
    serial?: number;
    serialNumber?: string;
    transferAmount?: number
  }[]
}

interface LoginResponseI {
  token?: string
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
  }[]
}
