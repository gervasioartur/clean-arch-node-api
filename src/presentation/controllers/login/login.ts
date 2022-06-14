import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { badRequest, serverError } from "../../../presentation/helpers/http-helper";
import { resolve } from "path";
import { Controller, HttpRequest, HttpResponse } from "../../protocols/";
import { EmailValidator } from "../sing-up";

export class LoginController implements Controller {
    constructor (
        private readonly emailValidator: EmailValidator
    ) {
        this.emailValidator = emailValidator    
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
     try {
        const { email, password } = httpRequest.body

        if (!email) {
            return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
        }

        if (!password) {
            return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
        }
        const isValid = this.emailValidator.isValid(email)

        if (!isValid) {
            return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
        }
     } catch (error) {
        return serverError(error)
     }
    }
}