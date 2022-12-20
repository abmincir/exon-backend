import { primeNumbers } from "../constants/PrimeNumbers";
import { GenerateControlNumberInputI } from "../types/AlgorithmsService.types"

const generateControlNumber = async ({
  factors,
  mode
}: GenerateControlNumberInputI): Promise<number> => {
  let primes = primeNumbers.slice(0, factors.length).reverse()

  let total = 0;
  for (let index = 0; index < factors.length; index++) {
    total += factors[index].firstId * primes[index]
  }

  if (mode === 1) {
    primes = primeNumbers.slice(1, factors.length + 1).reverse()
    for (let index = 0; index < factors.length; index++) {
      total += factors[index].firstId * primes[index]
    }
  }

  return total % 99;
}

module.exports = {
  generateControlNumber
}
