import { MissingParamError } from "../../../presentation/errors";
import { Validation } from "./validation";

export class RequedFieldValidation implements Validation {
    constructor (private readonly fiedlName: string) {
        this.fiedlName = fiedlName
    }

    validate (input: any): Error {
      if (!input[this.fiedlName]) {
        return new MissingParamError(this.fiedlName)
      }
    }
}