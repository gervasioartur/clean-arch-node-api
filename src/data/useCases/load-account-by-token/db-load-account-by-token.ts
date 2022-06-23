import { LoadAccountByToken, Decrypter, AccountModel, LoadAccountByTokenRepository } from './db-load-account-protocols'

export class DbLoadAccountBytoken implements LoadAccountByToken {
    constructor ( 
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
    ) { }

    async load (accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if (token) {
            await this.loadAccountByTokenRepository.loadByToken(token, role)
        }
        return null
    }   
}