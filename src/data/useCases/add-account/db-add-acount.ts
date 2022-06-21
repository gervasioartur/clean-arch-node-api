import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"
import { 
    AddAccount, 
    AddAccountModel, 
    Hasher, 
    AccountModel, 
    AddAccountRepository 
} from "./add-account-protocols"
export class DbAddAccount implements AddAccount {
    constructor (
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {}

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
        const hashedPassword = await this.hasher.hash(accountData.password)
        const accout = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
        return accout
    }
}
