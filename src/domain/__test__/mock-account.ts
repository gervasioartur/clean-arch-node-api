import { AccountModel } from "@/domain/models/Account"
import { AddAccountParams } from "@/domain/useCases/account/add-account"
import { AuthenticationParams } from "@/domain/useCases/authentication/authentication"

export const mockAccountModel = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
})

export const mockAuthentication = (): AuthenticationParams => ({
    email: 'any_email@email.com',
    password: 'any_password'
})