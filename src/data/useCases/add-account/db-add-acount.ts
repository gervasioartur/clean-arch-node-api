import { AddAccount, AddAccountModel, Encrypter, AccountModel } from "./db-add-account-protocols"
export class DbAddAccount implements AddAccount {
    constructor(private readonly encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        this.encrypter.encrypt(account.password)
        return new Promise(resolve => resolve(null))
    }
}