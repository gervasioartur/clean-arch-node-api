import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './singup-controller-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

export class SingUpController implements Controller {
    constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { name, email, password } = httpRequest.body
            const accountId = await this.addAccount.add({
                name,
                email,
                password
            })
            return ok(accountId)
        } catch (error) {
            return serverError(error)
        }
    }
}
