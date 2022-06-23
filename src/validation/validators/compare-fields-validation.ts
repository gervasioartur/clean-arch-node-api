import { InvalidParamError, MissingParamError } from "../../presentation/errors";
import { Validation } from "../../presentation/protocols/";

export class CompareFiedsValidation implements Validation {
  constructor (
    private readonly fieldName: string, 
    private readonly fiealdToCompare
  ) {
    this.fieldName = fieldName
    this.fiealdToCompare = fiealdToCompare
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fiealdToCompare]) {
      return new InvalidParamError(this.fiealdToCompare)
    }
  }
}