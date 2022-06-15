import { EmailValidator } from "../../protocols/email-validator";
import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "./validation";
import { badRequest } from "../http-helper";

export class EmailValidation implements Validation {
  constructor (
    private readonly fiedlName: string,
    private readonly emailValidator: EmailValidator
  ) {
    this.fiedlName = fiedlName
  }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fiedlName])
    if (!isValid) {
      return new InvalidParamError(input[this.fiedlName])
    }
  }
}