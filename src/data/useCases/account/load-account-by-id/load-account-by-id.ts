import { LoadAccountByIdRepository, AccountModel, LoadAccountById } from './db-load-accout-by-id-protocols'

export class DbLoadAccountById implements LoadAccountById {
    constructor (private readonly loadAccountById: LoadAccountByIdRepository) {}
    async load (accountId: any): Promise<AccountModel> | null {
        const account = await this.loadAccountById.loadById(accountId)
        return account
    }  
}
