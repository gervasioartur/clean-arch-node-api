import { Encrypter } from '@/data/protocol/encrypter'
import { AccountModel } from '@/domain/models/Account'
import { AddAccount, AddAccountModel } from '@/domain/useCases/add-account'

export class DbAddAccount implements AddAccount {
    constructor(private readonly encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        this.encrypter.encrypt(account.password)
        return new Promise(resolve => resolve(null))
    }
}