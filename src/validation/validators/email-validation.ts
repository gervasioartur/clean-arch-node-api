import { EmailValidator } from "../protocols/email-validator";
import { InvalidParamError } from "@/presentation/errors";
import { Validation } from "@/presentation/protocols/";

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