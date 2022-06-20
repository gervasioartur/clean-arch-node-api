import { Controller, HttpRequest, HttpResponse, AddAccount, LoadAccountById, Validation } from './singup-controller-protocols'
import { MissingParamError, InvalidParamError, UnauthorizedError } from '../../errors'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helper'

export class SingUpController implements Controller {
    constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly loadAccountByEmail: LoadAccountById
        
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
            const account = await this.loadAccountByEmail.load(accountId)
            if (!account) {
               return unauthorized()
            }
            return ok(account)
        } catch (error) {
            return serverError(error)
        }
    }
}
