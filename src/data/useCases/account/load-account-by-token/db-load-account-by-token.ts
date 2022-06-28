import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { LoadAccountByToken } from "@/domain/useCases/account/load-account-by-token";
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { AccountModel } from "@/domain/models/Account";

export class DbLoadAccountBytoken implements LoadAccountByToken {
    constructor ( 
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
    ) { }

    async load (accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if (token) {
            const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
            if (account) {
                return account
            }
        }
        return null
    }   
}