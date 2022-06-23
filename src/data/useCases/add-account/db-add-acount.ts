import { Hasher } from '../../protocols/criptography/hasher'
import { AccountModel } from '../../../domain/models/Account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
    constructor (
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {}

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
        if (!account) {
            const hashedPassword = await this.hasher.hash(accountData.password)
            return await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
        }
        return null
    }
}
