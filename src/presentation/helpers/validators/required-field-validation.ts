import { MissingParamError } from "../../../presentation/errors";
import { Validation } from "../../protocols/validation";

export class RequedFieldValidation implements Validation {
    constructor (private readonly fiedlName: string) {}

    validate (input: any): Error {
      if (!input[this.fiedlName]) {
        return new MissingParamError(this.fiedlName)
      }
    }
}