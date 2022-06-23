import { LoadAccountByToken, Decrypter, AccountModel } from './db-load-account-protocols'

export class DbLoadAccountBytoken implements LoadAccountByToken {
    constructor ( 
        private readonly decrypter: Decrypter
    ) { }

    async load (accessToken: string, role?: string): Promise<AccountModel> {
            await this.decrypter.decrypt(accessToken)
        return null
    }   
}