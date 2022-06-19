import { EmailValidator } from "../../protocols/email-validator";
import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";
import { badRequest } from "../http/http-helper";

export class EmailValidation implements Validation {
  constructor (
    private readonly fiedlName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fiedlName])
    if (!isValid) {
      return new InvalidParamError(input[this.fiedlName])
    }
  }
}