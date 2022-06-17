import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

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