import { badRequest, serverError, forbidden, ok } from '../../../helpers/http/http-helper'
import { EmailInUseError } from '../../../errors/index'
import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'
import { AddAccountModel,AddAccount } from '../../../../domain/useCases/add-account'
import { LoadAccountById } from '../../../../domain/useCases/load-account-by-id'
import { Authentication } from '../../../../domain/useCases/authentication'
import { AccountModel } from '../../../../domain/models/Account'

export class SingUpController implements Controller {
    constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication 
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            const { name, email, password } = httpRequest.body
            const account = await this.addAccount.add({ name,email, password })
            if (!account) {
                return forbidden(new EmailInUseError())
            }
            const accessToken = await this.authentication.auth({ email,password })
            return ok({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}
