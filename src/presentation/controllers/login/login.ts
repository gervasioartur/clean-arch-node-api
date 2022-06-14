import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { badRequest, serverError, unauthorized } from "../../../presentation/helpers/http-helper";
import { resolve } from "path";
import { Controller, HttpRequest, HttpResponse } from "../../protocols/";
import { EmailValidator } from "../sing-up";
import { Authentication } from "../../../domain/useCases/authentication";

export class LoginController implements Controller {
    constructor (
        private readonly emailValidator: EmailValidator,
        private readonly authentication: Authentication
    ) {
        this.emailValidator = emailValidator    
        this.authentication = authentication
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
     try {
        const requiredFields = ['email', 'password']
        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
        const { email, password } = httpRequest.body
        const isValid = this.emailValidator.isValid(email)
        if (!isValid) {
            return badRequest(new InvalidParamError('email'))
        }
       const accessToken = await this.authentication.auth(email, password)
       if (!accessToken) {
        return unauthorized()
       }
     } catch (error) {
        return serverError(error)
     }
    }
}