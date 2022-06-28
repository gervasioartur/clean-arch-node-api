import { AccountModel } from "@/domain/models/Account"
import { AddAccountParams } from "@/domain/useCases/account/add-account"

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