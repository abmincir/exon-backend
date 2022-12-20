import { depositStatement } from "../services/KooKService"

exports.getDeposit = async (req: any, res: any) => {

  // TODO: for more accurate checking, add validation for req.body to be
  // matched with DepositStatementInputI

  try {
    const result = await depositStatement(req.body)
    return res.status(200).send(result)
  } catch (e) {
    return res.status(409).send(e)
  }
}
