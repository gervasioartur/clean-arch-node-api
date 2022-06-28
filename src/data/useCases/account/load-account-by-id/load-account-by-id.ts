import { LoadAccountById } from "@/domain/useCases/account/load-account-by-id"
import { LoadAccountByIdRepository } from "@/data/protocols/db/account/load-account-by-id-repository"
import { AccountModel } from "@/domain/models/Account"

export class DbLoadAccountById implements LoadAccountById {
    constructor (private readonly loadAccountById: LoadAccountByIdRepository) {}
    async load (accountId: any): Promise<AccountModel> | null {
        const account = await this.loadAccountById.loadById(accountId)
        return account
    }  
}
