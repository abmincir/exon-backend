import { depositStatement } from '../services/KooKService';

exports.getDeposit = async (req: any, res: any) => {
  try {
    const result = await depositStatement(req.body);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(409).send(e);
  }
};

exports.insertSamanInfo = (req: any, res: any) => {
  const {
    id,
    agentBranchCode,
    agentBranchName,
    balance,
    branchCode,
    branchName,
    date,
    description,
    referenceNumber,
    registrationNumber,
    serial,
    serialNumber,
    transferAmount,
  } = req.body;

  SQLService.insertPaySamanBankInfo({
    id,
    agentBranchCode,
    agentBranchName,
    balance,
    branchCode,
    branchName,
    date,
    description,
    referenceNumber,
    registrationNumber,
    serial,
    serialNumber,
    transferAmount,
  }).then(
    (result: any) => {
      console.log(result);
      res.send(result);
    },
    (error: any) => console.error(error),
  );
};
