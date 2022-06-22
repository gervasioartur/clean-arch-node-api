import { LoadAccountById } from "../../../domain/useCases/load-account-by-id"
import { LoadAccountByIdRepository } from "../../protocols/db/account/load-account-by-id-repository"
import { AccountModel } from "../add-account/db-add-account-protocols"

export class DbLoadAccountById implements LoadAccountById {
    constructor (private readonly loadAccountById: LoadAccountByIdRepository) {}
    async load (accountId: any): Promise<AccountModel> | null {
        const account = await this.loadAccountById.loadById(accountId)
        return account
    }  
}
